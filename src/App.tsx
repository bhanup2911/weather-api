import { Box, Card , Icon, Input, Text , InputGroup ,InputLeftElement, Stack , Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer, List , ListItem  , ListIcon} from "@chakra-ui/react"

import { Link} from 'react-router-dom';
import { useState , useEffect , useRef } from "react";
import { IoLocationSharp } from "react-icons/io5";
import Loading from "./components/Loading";
import { MdCheckCircle } from "react-icons/md";

function App() {

  type Locations = {
    name : string ;
  }

  type cityData = {
    cou_name_en: string;
    name: string;
    timezone: string;
    coordinates : {
      lat : number , 
      lon : number,
    }
  }


  const [search , setSearch ] = useState<string>("");
  const [location , setLocation ] = useState<Locations[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10); 
  const [loading, setLoading] = useState<boolean>(true);
  // const [weatherCondition , setWeatherCondition] = useState<string>("day");
  const [cities , setCities ] = useState<cityData[]>([]);
  const containerRef = useRef(null);
  const numItems = useRef(0);
  const [ sortedData , setSortedData] = useState(cities); 
  const [ filterData , setfilterData] = useState<({[key : string ] : string})>({});


  const handleFilter = ( e : React.ChangeEvent<HTMLInputElement> , column : string ) => {
      const columnName : string = "name" ; 
      const value = e.target.value.toLowerCase();
      setfilterData({...filterData , [column] : value});
      const filtered = cities.filter((city: cityData) => city.name.toLowerCase().includes(value as string));
      setSortedData(filtered);
  }

  // const handleSort = ( column : string ) => {
  //     console.log("Sorting started!! ")
  //     const sorted = ([...sortedData]).sort((a,b)=>{
  //       return a[column].localeCompare(b[column]);
  //     });
  //     setSortedData(sorted);
  // }

  const handleSort = (key: keyof cityData) => {
    console.log("handleSort called", key)
    setSortedData(key);
    const sortedUsers = [...cities].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
    setCities(sortedUsers);
  };

  const fetchAllTheCities = async () => {
    const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=${limit}`;
    try {
      setLoading(true);
      const response = await fetch(url);
      const newData : any = await response.json();
      console.log(newData.results);
      setCities(prevData => [...prevData , ...newData.results]);
      numItems.current += newData.length;
     
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCities = async ( search : string) => {
    const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?${search}`;
    try {
      const response = await fetch(url);
      const newData : any = await response.json();
      setLocation(newData.results);
      setShowSuggestions(true);
    } catch (error) {
      console.log(error);
    }
  }


  const handleScroll = () => {
    const container = containerRef.current;
   
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Check if user has scrolled to the bottom of the container
      if (scrollTop + clientHeight + 10 >= scrollHeight) {
        setLimit(prevLimit => prevLimit + 5); // Load more data when user reaches the bottom
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setSearch(inputValue);
    fetchCities(inputValue.trim());
  };

const handleSelectLocation = (location: Locations) => {
  setSearch(location.name);
  setShowSuggestions(false);
  // Perform weather API request with the selected location
  // performWeatherRequest(location.name);
  };

  
  useEffect(() => {
    fetchAllTheCities(); // Fetch data whenever the limit changes
  }, [limit]); // Watch for changes in limit

  useEffect(()=>{
    fetchAllTheCities();
  }, []);

  useEffect(() => {
    const container: any = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);


  return (
    <Card bgGradient="linear(to-r , #12b2e2 , #4661ee) " h="100vh" w="100vw">
        <Stack px="10rem" spacing="1rem" m="2.5rem">
        <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Icon as={IoLocationSharp} color="gray.300" />}
        />
            <Input type="text" placeholder="Search location..." borderRadius="2rem" bg="gray.200"  value={search}  onChange={handleInputChange}/>
        </InputGroup>
        
          {showSuggestions && (
            
            <List bgColor="white" borderRadius="2rem"  p="1rem">
                {location.map((location, index) => (
                    <ListItem  key={index} onClick={() => handleSelectLocation(location)} >
                        <ListIcon as={MdCheckCircle} color='green.500' />
                        {location.name}
                    </ListItem >
                ))}
            </List>
        )}
        
          <Text textAlign="center" fontWeight="bold"> Cities List </Text>
          <Box h="25rem" overflowX="hidden" overflowY="auto" borderRadius="1.5rem" ref={containerRef}>
              <TableContainer >
                    <Table variant='simple'>
                      <Thead>
                        <Tr>
                          <Th onClick={() => handleSort('cou_name_en')} cursor="pointer" colorScheme="teal">Country</Th>
                          <Th onClick={() => handleSort('name')} cursor="pointer" colorScheme="teal">City</Th>
                          <Th onClick={() => handleSort('timezone')} cursor="pointer" colorScheme="teal" >Timezone</Th>
                        </Tr>
                      </Thead>
                      {cities.map((city , i )=>(
                          <Tbody  key = {i}>
                            <Tr>
                              <Td><Link to= {`city?lat=${city.coordinates.lat}&lng=${city.coordinates.lon}`} target="_blank" >{city.cou_name_en}</Link> </Td>
                              <Td>{city.name}</Td>
                              <Td>{city.timezone}</Td>
                            </Tr>
                          </Tbody>
                      ))}
                    </Table>
                    {loading && <Loading />}
                  </TableContainer>
                  </Box>
        </Stack>
    </Card>
  )
}

export default App;
