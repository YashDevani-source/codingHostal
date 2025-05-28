import React, {useEffect} from 'react'
import { useProblemStore } from '../store/useProblemStore'
import { Loader } from 'lucide-react'
import { use } from 'react'



function HomePage() {
  const {getAllProblems, problems, isProblemsLoading} = useProblemStore()

  useEffect(() => {
    getAllProblems()
  }, [])

  console.log("Problems", problems);
  
  return (
    <div className='min-h-screen flex flex-col items-center mt-14 px-4'>
      <div className='absoluter top-16 left-0 w-1/3 h-1/3 bg-primary opacity-30 blur-3xl rounded-md bottom-9'>
      </div>
      <h1 className='text-4xl font-extrabold z-10 text-center'>
        Welcome to <span className='text-primary'>Coding Host-AL</span>
      </h1>
      <p>
       A Platform Inspired by Leetcode which helps you to prepare for coding
        interviews and helps you to improve your coding skills by solving coding
        problems
      </p>
    </div>
  )
}

export default HomePage
