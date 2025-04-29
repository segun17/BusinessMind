import { useState } from 'react'
import { GoogleGenAI } from '@google/genai'
import { ClipLoader } from 'react-spinners';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

function App() {
    const [industry, setIndustry] = useState("")
    const [experienceLevel, setExperienceLevel] = useState("")
    const [businessType, setBusinessType] = useState("")
    const [challenges, setChallenges] = useState("")
    const [data, setData] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleGenerate = async () => {
        const prompt = `
          Act as a professional business advisor and help me generate actionable business advice.
          My industry is ${industry},
          My experience level is ${experienceLevel},
          My business type is ${businessType},
          And my current challenges are: ${challenges}.

          Please generate 3 practical business recommendations based on these details, formatted like this:
          - Strategic Solutions
          - Implementation Steps
          - Potential Outcomes

          Focus on providing clear, actionable advice that I can apply immediately to improve my business.
        `
        setIsLoading(true)
        try {
            const response: any = await ai.models.generateContent({
                model: 'gemini-2.0-flash-001',
                contents: prompt,
            });
            let text = response.candidates?.[0].content?.parts?.[0]?.text
            text = text.split("\n").filter((line: any) => !line.trim().toLowerCase().startsWith("* **link:**") && !line.includes("placeholder")).join("\n")
            console.log(response.candidates?.[0].content?.parts?.[0]?.text)
            setData(text)
            setIsLoading(false)
        } catch (error) {
            setData("BusinessMind is currently overloaded! Please try again later.")
        }
    }

    return (
        <div>
            <div className='flex justify-center mt-5 '>
                <div className='shadow p-4 rounded lg:w-2/5 space-y-5'>
                    <div className='text-center font-bold text-4xl text-blue-600'>BusinessMind</div>
                    <div className='flex w-full gap-10'>
                        <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder='Your industry' className='border w-full p-2 rounded border-blue-600 ring-blue-950' />
                        <input value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} placeholder='Experience level' className='border w-full p-2 rounded border-blue-600 ring-blue-950' />
                    </div>
                    <div>
                        <input value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder='Business type (e.g., startup, SME, corporation)' className='border w-full p-2 rounded border-blue-600 ring-blue-950' />
                    </div>
                    <div>
                        <textarea value={challenges} onChange={(e) => setChallenges(e.target.value)} placeholder='Describe your business challenges or goals' className='resize-none border w-full p-2 rounded border-blue-600 ring-blue-950' />
                    </div>
                    <div className={`${isLoading ? "bg-blue-300" : "bg-blue-600"} rounded p-3 w-full text-center text-white`}>
                        <button onClick={handleGenerate}>{isLoading ? "Generating Advice..." : "Get Business Advice"}</button>
                    </div>
                    <div className='border rounded p-3 border-blue-600 h-68 overflow-auto'>
                        {data}
                        {
                            isLoading && <ClipLoader />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App