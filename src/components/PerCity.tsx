
import {Box , Text , HStack , Stack ,Card , Icon } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useEffect , useState } from "react";
import { FaCloud } from "react-icons/fa6";// cloud
import { FaCloudRain } from "react-icons/fa"; // rain 
import { FaCloudSun } from "react-icons/fa"; // sun
import { WiHumidity } from "react-icons/wi"; // humidity 
import { FaTemperatureArrowDown } from "react-icons/fa6"; // min-temp
import { FaTemperatureArrowUp } from "react-icons/fa6"; // max-temp
import { FaTemperatureQuarter } from "react-icons/fa6"; // temp 
import { WiDegrees } from "react-icons/wi";
import { WiWindy } from "react-icons/wi";
import { WiSunset } from "react-icons/wi";
import { WiSunrise } from "react-icons/wi";



type eachCityData = {
    main : {
        feels_like : number , 
        humidity : number,
        temp : number,
        temp_min : number,
        temp_max : number,
        pressure : number,
        sea_level : number,
    },
    sys : {
        country : string ,
        sunrise : number ,
        sunset : number ,
    },
    name : string , 
    timezone : number ,
    weather : [
        {
            main: string,
            description: string,
        }],
    wind : {
        speed : number,
        deg : number,
    }
};


const PerCity = () => {

    const [loading , setLoading ] = useState<boolean>(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    console.log(lat, lng);

    
    const [cityData , setCityData] = useState<eachCityData | null >(null);

    const APIKey = "7584ef96c3395f03769880e85cdc8e99";

    const fetchAllCitiesData = async () => {
        try {
            setLoading(true);
            const url1 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${APIKey}`;
            const response = await fetch(url1 , {
                headers:{
                    accept: 'application/json',
                  }
            });
            const newData : any = await response.json();
            setCityData(newData);
            setLoading(false);
            console.log(newData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAllCitiesData();
    }, []);

    function convertKelvinToCelcius( kelvin : number ) : string {
        const celcius : number = kelvin - 273.15 ; 
        if(celcius > 0 ){
            return `${Math.floor(celcius)}`;
        } else {
            return `- ${Math.floor(celcius)}`;
        }
    }

    
    let icon : any ;
    if ( cityData?.weather[0].main === "Clouds"){
            icon = FaCloud ;
    }else {
            icon = FaCloudRain ;
    } 

    function unixTimestampToUTC(unixTimestamp: number): string {
        // Create a new Date object using the Unix timestamp (in milliseconds)
        const date = new Date(unixTimestamp * 1000);
    
        // Get the hours, minutes, and seconds from the date object
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    
        // Format the time as HH:MM:SS
        return `${hours}:${minutes}`;
    }


    



    
  return (
    <>
        <Box bgGradient = "linear(to-r ,#f1f5fe , #596471)" h="100vh" w="100vw">
            <Stack>
                <HStack justify="center" p="2rem">
                    {/* <Text  textAlign="center" >{cityData?.name}  <Text >    C  </Text > </Text> */}
                    <Text as="p" fontSize="3rem"> {cityData?.name} : </Text>
                    <Text as="h1" fontSize="8rem"> {convertKelvinToCelcius(cityData?.main.feels_like)} <Icon as={ WiDegrees } /> C </Text>
                </HStack>
                <HStack justify="center">
                        <Text fontSize="2.5rem"> <Icon as={icon}/> {cityData?.weather[0].main} - {cityData?.weather[0].description} </Text>
                </HStack>
                <HStack m="3rem"  spacing="5rem" px="12rem" py="8rem" justify="center">
                    <Card bg={"transparent"} h="8rem" w="12rem" borderRadius="1.4rem" fontWeight="bold" fontSize="1.1rem" textAlign="center">
                        <Text >Max Temp :  <Icon as={FaTemperatureArrowDown} />{convertKelvinToCelcius(cityData?.main.temp_max)} <Icon as={ WiDegrees } /> C </Text>
                        <Text >Min Temp :  <Icon as={FaTemperatureArrowUp}  /> {convertKelvinToCelcius(cityData?.main.temp_min)} <Icon as={ WiDegrees } /> C</Text>
                        <Text >Humidity :  <Icon as={WiHumidity}  /> {cityData?.main.humidity}</Text>
                    </Card>
                    <Card bg={"transparent"} h="8rem" w="12rem"  borderRadius="1.4rem" fontWeight="bold" fontSize="1.1rem" textAlign="center">
                        <Text> Wind <Icon as={WiWindy }/> </Text>
                        <Text> Deg : {cityData?.wind.deg}</Text>
                        <Text> Speed : {cityData?.wind.speed}</Text>
                    </Card>
                    <Card bg={"transparent"} h="8rem" w="12rem"  borderRadius="1.4rem" fontWeight="bold" fontSize="1.1rem" textAlign="center">
                       
                        <Text> <Icon as={  WiSunrise } /> Sunrise  : { unixTimestampToUTC(cityData?.sys.sunrise) }</Text>
                        <Text> <Icon as={ WiSunset } />  Sunset : {unixTimestampToUTC(cityData?.sys.sunset)}</Text>
                    </Card>
                </HStack>
            </Stack>
             
        </Box>
    </>
  )
}

export default PerCity;