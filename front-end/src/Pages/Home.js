import { React } from "react";
import Carrousel from "../Components/Carrousel/Carrousel";
import RegisterContainer from "../Components/RegisterContainer/RegisterContainer";
import InfosCarrousel from "../Components/Infos Carrousel/InfosCarrousel";
import Contacts from "../Components/Contacts/Contacts";

function Home() {

    return (

        <div>
            <Carrousel></Carrousel>
            <RegisterContainer></RegisterContainer>
            <InfosCarrousel></InfosCarrousel>
            <Contacts></Contacts>
        </div>
    );

}

export default Home;
