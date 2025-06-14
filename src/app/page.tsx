import Section1 from "@/components/Section1"
import Section2 from "@/components/Section2"
import Navbar from "@/components/Nav"
const Homepage = () => {
  return (
    <div className=" space-y-20 " >
          
          <div className="bg-[#27282c]">
            <Navbar />
            <main
              className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center px-4 py-20 xl:px-0"
              id="globalSection"
            >
              <Section1 />
            <Section2 />
            </main>
          </div>
    </div>

  )
}

export default Homepage