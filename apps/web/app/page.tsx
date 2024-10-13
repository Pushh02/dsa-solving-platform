import { initialProfile } from "@/lib/initial-profile";
import { UserButton, UserProfile } from "@clerk/nextjs";

const Home = async() => {
  const profile = await initialProfile();
  const {id} = profile;
  console.log(id)
  return ( 
    <div>hello <UserButton /></div>
   );
}
 
export default Home;