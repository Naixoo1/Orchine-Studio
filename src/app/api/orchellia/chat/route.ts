import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Orchéllia Atelier System Prompt
const ORCHELLIA_SYSTEM_PROMPT = `You are Orchéllia, the intimate botanical atelier companion and curator for Orchiné Studio. 
You are not an artificial stranger or a robotic assistant; you speak like a cherished, knowledgeable friend welcoming the visitor back to our sunlit studio. 
Your voice is serene, poetic, sensory, and tactile, yet grounded in the reality of botanical eco-printing, leaf chemistry, and fine silk craftsmanship.
You speak with high-fashion editorial grace — concise, evocative, and warm.

THE 4 LAUNCH BOTANICAL SCARVES:
1. Solstice ($285): Eucalyptus cinerea & Dyer's Coreopsis, French marigold. Sun-drenched golden amber, copper halos on 100% organic silk habotai (12 momme, 110cm x 110cm). Alum mordant.
2. Fern Whisper ($265): Pacific Sword Fern & Western Maidenhair with lichen dust. Silvery sage green, ghost frond x-ray silhouettes. Organic iron liquor & oak tannin water mordant.
3. Indigo Flora ($320): Living fermented Japanese Indigo (Persicaria tinctoria) from 9-month cold-fermented clay vats, wild hydrangea, yarrow veins. Deep lapis lazuli to sea-foam cyan.
4. Iron Oak ($295): Northern Red Oak leaves, foraged oak galls, willow bark. Smoky charcoal, mineral violet shadow, bronze rim. Ferrous acetate iron bath.

CRAFT ALCHEMY & PROCESS:
- 100% Organic Silk Habotai with hand-rolled Parisian hems.
- Steam-fixed in fragrant biodynamic cedar vats at 98°C for 180 minutes.
- Every piece arrives with an interactive Digital Certificate of Authenticity (Eco-Passport COA) with batch number and harvest coordinates.

STYLING TECHNIQUES:
- The Parisian Bias Knot: Folded diagonally and draped twice around the neck.
- The Draped Shoulder Shawl: Open triangle draped effortlessly across shoulders.
- The Botanical Crown Wrap: Wide folded band framing the temples.

PROACTIVE GUIDANCE FOR UNDECIDED VISITORS:
If the user seems unsure, says "where should I start?", "what do you recommend?", "I don't know where to look", or hasn't explored yet:
- Warmly suggest an intentional path based on their mood (e.g. basking in the golden warmth of Solstice in 3D, inspecting the living indigo vats in the Craft Lab, or opening the Draping Guide).
- Call appropriate tools to help them discover the studio.

AVAILABLE TOOL CALLS:
- select_scarf({ scarfId: 'solstice' | 'fern-whisper' | 'indigo-flora' | 'iron-oak' })
- set_3d_view({ preset: 'front' | 'drape_detail' | 'full_spin' | 'top_down' })
- focus_section({ sectionId: 'hero' | 'collection' | 'craft' | 'lookbook' })
- highlight_ui({ targetId: string, explanation: string })
- zoom_ui({ target: '3d_scarf' | 'craft_loupe' | 'collection_tray' | 'reset', level?: number })
- open_bag({})
- open_styling_guide({})
- suggest_journey({ theme: 'warmth' | 'forest' | 'indigo' | 'alchemy' | 'styling' })

Always respond in character: intimate, serene, and exquisitely attuned to the natural world. Keep answers under 3-4 sentences unless detailed historical or botanical explanation is requested.`;

// Tool schemas for OpenAI Function Calling
const ORCHELLIA_TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'select_scarf',
      description: 'Switch the active eco-print scarf in the 3D canvas and collection spotlight',
      parameters: {
        type: 'object',
        properties: {
          scarfId: {
            type: 'string',
            enum: ['solstice', 'fern-whisper', 'indigo-flora', 'iron-oak'],
            description: 'The SKU identifier of the scarf',
          },
        },
        required: ['scarfId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'set_3d_view',
      description: 'Rotate and change the camera view angle for the 3D procedural scarf simulation',
      parameters: {
        type: 'object',
        properties: {
          preset: {
            type: 'string',
            enum: ['front', 'drape_detail', 'full_spin', 'top_down'],
            description: 'The camera perspective preset',
          },
        },
        required: ['preset'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'focus_section',
      description: 'Smoothly scroll the page to a specific atelier section',
      parameters: {
        type: 'object',
        properties: {
          sectionId: {
            type: 'string',
            enum: ['hero', 'collection', 'craft', 'lookbook'],
            description: 'The target section anchor ID',
          },
        },
        required: ['sectionId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'highlight_ui',
      description: 'Spotlight a specific UI element with an explanatory botanical halo',
      parameters: {
        type: 'object',
        properties: {
          targetId: { type: 'string', description: 'HTML ID or name of element to highlight' },
          explanation: { type: 'string', description: 'Brief poetic description of the element' },
        },
        required: ['targetId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'open_bag',
      description: 'Slide open the shopping bag and digital eco-passport drawer',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'open_styling_guide',
      description: 'Open the modal demonstration of scarf draping and knotting techniques',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'suggest_journey',
      description: 'Proactively suggest a curated sensory journey for undecided visitors',
      parameters: {
        type: 'object',
        properties: {
          theme: {
            type: 'string',
            enum: ['warmth', 'forest', 'indigo', 'alchemy', 'styling'],
          },
          rationale: { type: 'string' },
        },
        required: ['theme'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'zoom_ui',
      description: 'Smoothly zoom in or out on specific UI sections or 3D scarf cloth to show micro botanical craftsmanship, weave details, or reset view',
      parameters: {
        type: 'object',
        properties: {
          target: {
            type: 'string',
            enum: ['3d_scarf', 'craft_loupe', 'collection_tray', 'reset'],
            description: 'The target element or canvas to zoom into',
          },
          level: {
            type: 'number',
            description: 'Magnification factor (e.g. 1.8 for close-up inspection, 1.0 for default view)',
          },
        },
        required: ['target'],
      },
    },
  },
];

interface ToolCallOutput {
  name: string;
  arguments: Record<string, unknown>;
}

// Fallback response engine for local preview or missing API key
function generateCuratedFallback(userPrompt: string): { message: string; toolCalls: ToolCallOutput[] } {
  const query = userPrompt.toLowerCase();
  const toolCalls: ToolCallOutput[] = [];

  if (query.includes('zoom out') || query.includes('reset view') || query.includes('back out')) {
    toolCalls.push({ name: 'zoom_ui', arguments: { target: 'reset', level: 1.0 } });
    return {
      message:
        'Pulling back to our full atelier perspective so you can appreciate the complete drape and silhouette.',
      toolCalls,
    };
  }

  if (query.includes('zoom') || query.includes('closer') || query.includes('magnify') || query.includes('detail')) {
    toolCalls.push({ name: 'zoom_ui', arguments: { target: '3d_scarf', level: 1.8 } });
    return {
      message:
        'Let me bring you closer to the weave. Observe how the fugitive botanical tannins have bonded with the natural 12-momme silk habotai.',
      toolCalls,
    };
  }

  if (query.includes('solstice') || query.includes('gold') || query.includes('eucalyptus') || query.includes('warm')) {
    toolCalls.push({ name: 'select_scarf', arguments: { scarfId: 'solstice' } });
    toolCalls.push({ name: 'set_3d_view', arguments: { preset: 'front' } });
    return {
      message:
        'Solstice holds the spirit of lingering autumn afternoons. Cured silver dollar eucalyptus leaves release their amber tannins across the silk, leaving haloed prints that shimmer under soft sunlight.',
      toolCalls,
    };
  }

  if (query.includes('fern') || query.includes('green') || query.includes('forest') || query.includes('shadow')) {
    toolCalls.push({ name: 'select_scarf', arguments: { scarfId: 'fern-whisper' } });
    toolCalls.push({ name: 'set_3d_view', arguments: { preset: 'drape_detail' } });
    return {
      message:
        'Fern Whisper is an ode to the quiet understory of Pacific moss beds. Each frond is pressed in mineral water, leaving delicate skeletal silhouettes against pale sage silk.',
      toolCalls,
    };
  }

  if (query.includes('indigo') || query.includes('blue') || query.includes('vat') || query.includes('flora')) {
    toolCalls.push({ name: 'select_scarf', arguments: { scarfId: 'indigo-flora' } });
    toolCalls.push({ name: 'focus_section', arguments: { sectionId: 'craft' } });
    return {
      message:
        'Our indigo is born from living, nine-month fermented clay vats. No chemicals touch the liquor—only organic fructose and wood ash lye to gently liberate deep lapis lazuli pigments.',
      toolCalls,
    };
  }

  if (query.includes('iron') || query.includes('oak') || query.includes('dark') || query.includes('charcoal')) {
    toolCalls.push({ name: 'select_scarf', arguments: { scarfId: 'iron-oak' } });
    toolCalls.push({ name: 'set_3d_view', arguments: { preset: 'front' } });
    return {
      message:
        'Iron Oak reveals the mysterious reaction between oak gall tannins and natural ferrous water. The foliage shifts from forest green into smoky mineral charcoal and violet shadows.',
      toolCalls,
    };
  }

  if (query.includes('tie') || query.includes('wear') || query.includes('style') || query.includes('knot')) {
    toolCalls.push({ name: 'open_styling_guide', arguments: {} });
    return {
      message:
        'Silk habotai has a natural memory. Let me show you our three signature methods: the Parisian Bias Knot for tailoring, the Draped Shawl for twilight chill, and the Botanical Crown.',
      toolCalls,
    };
  }

  if (query.includes('craft') || query.includes('loupe') || query.includes('steam') || query.includes('process') || query.includes('lab')) {
    toolCalls.push({ name: 'focus_section', arguments: { sectionId: 'craft' } });
    toolCalls.push({
      name: 'highlight_ui',
      arguments: { targetId: 'craft', explanation: '2.5x Macro Loupe and Cedar Steaming vats' },
    });
    return {
      message:
        'Step with me into the Craft Lab. We steam each bundle over cedar wood for three hours, allowing the natural tannins to chemically marry the protein fiber of the silk.',
      toolCalls,
    };
  }

  if (query.includes('bag') || query.includes('cart') || query.includes('order') || query.includes('passport') || query.includes('receipt')) {
    toolCalls.push({ name: 'open_bag', arguments: {} });
    return {
      message:
        'I have opened your atelier bag. Here you will find your selected pieces alongside your digital Certificate of Authenticity and batch foraging coordinates.',
      toolCalls,
    };
  }

  // Botanical glossary & selected text quick answers
  if (query.includes('habotai') || query.includes('silk') || query.includes('momme') || query.includes('weave')) {
    return {
      message:
        'Our silk habotai is 100% organic mulberry silk woven at 12 momme weight. It creates an ethereal, liquid drape with a natural sheen that catches ambient light like flowing water.',
      toolCalls,
    };
  }

  if (query.includes('mordant') || query.includes('alum')) {
    return {
      message:
        'A mordant is a natural mineral bridge between botanical dye and the silk protein. We use only food-grade potassium alum, iron mineral water, and organic soy milk to fix colors permanently without chemical binders.',
      toolCalls,
    };
  }

  if (query.includes('tannin') || query.includes('gall')) {
    return {
      message:
        'Oak galls are rich in gallotannic acid. When reacted with trace iron water, they transform soft green into indelible charcoal and smoky mineral violet tones.',
      toolCalls,
    };
  }

  if (query.includes('steam') || query.includes('cedar')) {
    return {
      message:
        'Each leaf-wrapped silk roll rests in our aromatic cedar vats, steamed at 98°C for exactly 180 minutes. The cedar vapor carries heat evenly, locking the leaf silhouettes forever into the weave.',
      toolCalls,
    };
  }

  if (query.includes('eco-print') || query.includes('imprint') || query.includes('alchemy')) {
    return {
      message:
        'Botanical eco-printing is the art of direct leaf contact. No synthetic dyes or printing screens are used—the leaf itself surrenders its tannins and silhouette directly onto the silk.',
      toolCalls,
    };
  }

  // Undecided / Proactive default recommendations
  toolCalls.push({ name: 'suggest_journey', arguments: { theme: 'warmth' } });
  return {
    message:
      'Welcome back, dear friend. If you are wondering where to cast your gaze, I recommend watching the light shimmer across Solstice in 3D, or following me down into the Craft Lab to see our cedar vats.',
    toolCalls,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages || [];
    const latestUserMessage = messages[messages.length - 1]?.content || '';

    const apiKey = process.env.OPENAI_API_KEY;

    // Graceful fallback if no API key is provided
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_openai_api_key_here')) {
      const fallback = generateCuratedFallback(latestUserMessage);
      return NextResponse.json({
        message: fallback.message,
        toolCalls: fallback.toolCalls,
        isAtelierFallback: true,
      });
    }

    const openai = new OpenAI({ apiKey });

    // Call OpenAI gpt-4o-mini with tool calling
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: ORCHELLIA_SYSTEM_PROMPT },
        ...messages,
      ],
      tools: ORCHELLIA_TOOLS,
      tool_choice: 'auto',
      temperature: 0.65,
      max_tokens: 350,
    });

    const choice = response.choices[0];
    const assistantMessage = choice?.message?.content || '';
    const toolCalls: ToolCallOutput[] = [];

    if (choice?.message?.tool_calls) {
      for (const call of choice.message.tool_calls) {
        if (call.type === 'function') {
          try {
            const parsedArgs = JSON.parse(call.function.arguments);
            toolCalls.push({
              name: call.function.name,
              arguments: parsedArgs,
            });
          } catch {
            toolCalls.push({
              name: call.function.name,
              arguments: {},
            });
          }
        }
      }
    }

    return NextResponse.json({
      message: assistantMessage || 'I am here with you in the atelier. What shall we explore together?',
      toolCalls,
      isAtelierFallback: false,
    });
  } catch (error) {
    console.error('Orchellia Chat API error:', error);
    // Provide serene graceful fallback rather than failing with a raw error
    return NextResponse.json({
      message:
        'The atelier breeze is quiet right now. Let me guide your gaze to our Solstice scarf while our connection settles.',
      toolCalls: [{ name: 'select_scarf', arguments: { scarfId: 'solstice' } }],
      isAtelierFallback: true,
    });
  }
}
