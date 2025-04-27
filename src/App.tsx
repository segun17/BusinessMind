import  { useState } from 'react'
import { GoogleGenAI } from '@google/genai'
import { ClipLoader } from 'react-spinners';
const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_KEY});

function App() {
    const [age,setAge]=useState("")
    const [gender,setGender]=useState("")
    const [experience,setExperince]=useState("")
    const [prefrences,setPrev]=useState("")
    const [data,setData]=useState("")
    const [isLoading,setIsloading]=useState(false)

    const handleGenerate= async()=>{
        const prompt=`
          Help me to generate relationship advice, 
         my age range is ${age},
         my gender is ${gender},
         and my past experience is relationship is ${experience},
         and use this prefrences ${prefrences} to also generate it for 3.

         Now generate 3 relationship advice with my details and it should come like this:
         - Solutions
         - How to get a new one or so
         }
        `
        setIsloading(true)
      try {
        const response:any = await ai.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: prompt,
          });
         let text= response.candidates?.[0].content?.parts?.[0]?.text
          text= text.split("\n").filter((line:any)=>!line.trim().toLowerCase().startsWith("* **link:**")&& !line.includes("placeholder")).join("\n")
          console.log(response.candidates?.[0].content?.parts?.[0]?.text)
          setData(text)
          setIsloading(false)
      } catch (error) {
        setData("RelateMind is overloaded! Pls Try again!")
      }
    }
  return (
    <div>
      <div  className='flex justify-center mt-5 '>
        <div className='shadow p-4 rounded lg:w-2/5 space-y-5'>
        <div className='text-center font-bold text-4xl text-green-600'>RelateMind</div>
       <div className='flex  w-full gap-10'>
       <input value={age} onChange={(e)=>setAge(e.target.value)} placeholder='age range' className='border w-full p-2 rounded border-green-600 ring-green-950'/>
       <input value={gender} onChange={(e)=>setGender(e.target.value)} placeholder='gender'className='border w-full p-2 rounded border-green-600 ring-green-950'/>
       </div>
       <div>
       <textarea value={experience} onChange={(e)=>setExperince(e.target.value)} placeholder='Past relations experience' className=' resize-none border w-full p-2 rounded border-green-600 ring-green-950'/>
       </div>
       <div>
       <textarea value={prefrences} onChange={(e)=>setPrev(e.target.value)} placeholder='Type your prefrences, e.g (am nigeria and depressed with the been alone all the time)' className=' resize-none border w-full p-2 rounded border-green-600 ring-green-950'/>
       </div>
          <div className={`${isLoading?"bg-green-300":"bg-green-600"} rounded p-3 w-full text-center text-white`}>
            <button onClick={handleGenerate}>{isLoading?"Generating.....":"Generate"}</button>
          </div>
          <div className='border rounded p-3 border-green-600 h-68 overflow-auto'>
            {data}
           {
            isLoading&&<ClipLoader/>
           }
          </div>
        </div>
      </div>
    </div>
  )
}

export default App


// AIzaSyBz1rbzSz45itCHbhcMbxsdkQkA5RPuXqg
