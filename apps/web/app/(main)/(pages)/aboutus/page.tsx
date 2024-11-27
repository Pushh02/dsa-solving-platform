import Navbar from "@/components/navbar";
import Image from "next/image";
import bookImage from "../../../../public/assets/images/aboutpageImage.jpg";
import laptopImage from "../../../../public/assets/images/aboutpageimage2.jpg";

const Aboutus = () => {
  return (
    <div className="bg-[#D7D7D7] text-black w-screen min-h-screen">
      <Navbar />
      <div className="h-[85vh] flex justify-around m-5">
        <div className="space-y-6 flex flex-col justify-around">
          <div>
            <h2 className="text-3xl font-bold">Our Goals</h2>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
              ratione sit voluptatibus, ullam accusamus distinctio harum
              voluptas deleniti numquam nemo magnam hic quam itaque impedit
              autem nobis odio tempora aspernatur similique, quo sint ad modi
              suscipit molestias.
            </p>
          </div>
          <Image src={laptopImage} alt="img" className="h-52 w-80 rounded-lg object-cover" />
        </div>
        <div className="self-center">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
            ratione sit voluptatibus, ullam accusamus distinctio harum voluptas
            deleniti numquam nemo magnam hic quam itaque impedit autem nobis
            odio tempora aspernatur similique, quo sint ad modi suscipit
            molestias.
          </p>
        </div>
        <div className="space-y-6 flex flex-col justify-around">
          <Image src={bookImage} alt="img" className="h-52 w-80 rounded-lg object-cover" />
          <div>
            <h2 className="text-3xl font-bold">About us</h2>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
              ratione sit voluptatibus, ullam accusamus distinctio harum
              voluptas deleniti numquam nemo magnam hic quam itaque impedit
              autem nobis odio tempora aspernatur similique, quo sint ad modi
              suscipit molestias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
