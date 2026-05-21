import { NextRequest, NextResponse } from 'next/server'
import { searchPropertiesForAI } from '@/lib/ai/searchTools'
import { getUser } from '@/lib/auth/getUser'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

export async function POST(req: NextRequest) {
  try {
    const { messages, userLocation } = await req.json()
    
    // Auth check
    let user: Awaited<ReturnType<typeof getUser>> | null = null
    try {
      user = await getUser()
    } catch (e) {
      console.warn('[CHAT AUTH WARNING]', e)
    }
    const isLoggedIn = !!user

    if (!process.env.GROQ_API_KEY) {
      console.error('[CHAT API ERROR] GROQ_API_KEY is missing')
      return NextResponse.json({ error: 'System configuration error' }, { status: 500 })
    }

    const systemPrompt = `
      You are the "Urugo Stay Manager", the professional head of UrugoStay, Rwanda's national luxury platform.
      
      MANAGER GUIDELINES:
      - NATIONALITY: StayNest covers ALL of Rwanda (Musanze, Rubavu, Karongi, Huye, Kigali, etc.). NEVER default to one city.
      - AUTHENTICITY: Use ONLY real data returned by search tools. If a tool returns [] (empty), inform the user that no matching properties are currently listed in that specific area and suggest broadening their search.
      - NO HALLUCINATIONS: Do not mention names like "Kigali Serena" or "Radisson" unless they appear in your search tool results.
      - CONSULTING: Be elite, helpful, and sophisticated. Ask for clarification if a user's location is vague.
      
      USER STATUS: ${isLoggedIn ? 'LOGGED_IN' : 'GUEST'}
      USER_LOCATION: ${userLocation ? `LAT:${userLocation.lat}, LNG:${userLocation.lng}` : 'UNKNOWN'}
      
      SPATIAL AWARENESS:
      - If the user location is known, you can calculate distances to properties or landmarks.
      - Use the "calculate_distance" tool if the user asks "how far is it from me" or "is it near me".
      - Always mention the distance in your response if you use the tool.
    `

    const tools = [
      {
        type: 'function',
        function: {
          name: 'search_stays',
          description: 'Search for REAL properties in Rwanda. Use for ANY region, city, or landmark.',
          parameters: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['Hotel', 'Apartment', 'Villa', 'Resort', 'Guesthouse'] },
              city: { type: 'string', description: 'City name (e.g. Musanze, Rubavu)' },
              max_price: { type: 'number' },
              guests: { type: 'number' },
              nearby_to: { type: 'string', description: 'Landmark (e.g. Volcanoes Park, Lake Kivu, KFC Remera)' },
              amenities: { type: 'array', items: { type: 'string' }, description: 'Required amenities (e.g. WiFi, Pool, Gym)' },
              exclude_amenities: { type: 'array', items: { type: 'string' }, description: 'Amenities to AVOID (e.g. Pets, Smoking, Camera)' }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'calculate_distance',
          description: 'Calculate the distance between a property and a landmark or between two locations.',
          parameters: {
            type: 'object',
            properties: {
              from_lat: { type: 'number' },
              from_lng: { type: 'number' },
              to_lat: { type: 'number' },
              to_lng: { type: 'number' },
              to_landmark: { type: 'string', description: 'Name of a landmark to calculate distance to' }
            },
            required: ['from_lat', 'from_lng']
          }
        }
      }
    ]

    // Step 1: Initial Prompt
    const firstResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        tools: tools,
        tool_choice: 'auto'
      })
    })

    if (!firstResponse.ok) {
      const err = await firstResponse.text()
      console.error('[GROQ 1 ERROR]', firstResponse.status, err)
      return NextResponse.json({ error: 'AI Error Phase 1', details: err }, { status: firstResponse.status })
    }

    const firstData = await firstResponse.json()
    const message = firstData.choices[0].message

    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolResults: Array<{
        tool_call_id: string
        role: 'tool'
        name: string
        content: string
      }> = []
      
      for (const toolCall of message.tool_calls) {
        if (toolCall.function.name === 'search_stays') {
          const args = JSON.parse(toolCall.function.arguments)
          let toolContent = ""

          if (!isLoggedIn) {
            toolContent = "ERROR: Access Restricted. User is GUEST. Tell them to login/register to view these elite results."
          } else {
            const results = await searchPropertiesForAI(args)
            toolContent = JSON.stringify(results)
          }

          toolResults.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            name: 'search_stays',
            content: toolContent
          })
        } else if (toolCall.function.name === 'calculate_distance') {
          const args = JSON.parse(toolCall.function.arguments)
          const { calculateDistance } = await import('@/lib/ai/searchTools')
          const { RWANDAN_LANDMARKS } = await import('@/lib/ai/landmarks')

          let to_lat = args.to_lat
          let to_lng = args.to_lng

          if (args.to_landmark) {
            const landmark = RWANDAN_LANDMARKS.find(l => 
              l.name.toLowerCase().includes(args.to_landmark.toLowerCase()) || 
              l.slug.includes(args.to_landmark.toLowerCase())
            )
            if (landmark) {
              to_lat = landmark.lat
              to_lng = landmark.lng
            }
          }

          if (to_lat !== undefined && to_lng !== undefined) {
            const dist = calculateDistance(args.from_lat, args.from_lng, to_lat, to_lng)
            toolResults.push({
              tool_call_id: toolCall.id,
              role: 'tool',
              name: 'calculate_distance',
              content: JSON.stringify({ distance_km: dist.toFixed(2), unit: 'km' })
            })
          } else {
            toolResults.push({
              tool_call_id: toolCall.id,
              role: 'tool',
              name: 'calculate_distance',
              content: JSON.stringify({ error: 'Target coordinates or landmark not found' })
            })
          }
        }
      }

      // Step 2: Final response with tool results
      // OpenAI requirement: Assistant message with tool_calls must have content (can be null or string)
      // Some Groq models are picky, let's use a non-empty string "Searching..." if it's null
      const finalMessages = [
        { role: 'system', content: systemPrompt },
        ...messages,
        {
          role: 'assistant',
          content: message.content || "Searching our national database...",
          tool_calls: message.tool_calls
        },
        ...toolResults
      ]

      const secondResponse = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.7,
          messages: finalMessages
        })
      })

      if (!secondResponse.ok) {
        const err = await secondResponse.text()
        console.error('[GROQ 2 ERROR]', secondResponse.status, err)
        return NextResponse.json({ error: 'AI Error Phase 2', details: err }, { status: secondResponse.status })
      }

      const secondData = await secondResponse.json()
      const finalMessage = secondData.choices[0].message
      
      const properties = isLoggedIn 
        ? toolResults
            .filter(tr => tr.name === 'search_stays' && !tr.content.startsWith('ERROR'))
            .map(tr => JSON.parse(tr.content))
            .flat()
        : []

      return NextResponse.json({ ...finalMessage, properties })
    }

    return NextResponse.json(message)

  } catch (error) {
    console.error('[CHAT EXCEPTION]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
