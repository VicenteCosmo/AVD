import { FooterWithLogo } from "@/components/footer"
import Section1 from "@/components/section1";
import Section2 from "@/components/section2";
import {Navbar} from "@/components/Navbar3"
const Homepage = () => {
  return (
    <div className=" space-y-20 ">
      <Navbar/>
      <Section1 />
      <Section2 />
      <h1> Hello, Cosmo </h1>
    </div>
  );
};

export default Homepage;
