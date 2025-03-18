import { useParams, Link, useNavigate } from "react-router-dom";
import NotFound from "./NotFound";
import {useState, useEffect} from 'react'
import { Tabs, Tab, TableHeader, TableRow, TableColumn, Table, TableBody, TableCell, Pagination, User, Dropdown, DropdownTrigger, Spinner,
Button, DropdownMenu, DropdownItem} from "@nextui-org/react"
import Loading from "../components/Loading";

export const VerticalDotsIcon = ({size = 24, width, height, ...props}) => (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  );


const Search = () => {
    const columns = [
        {name: "NAME", uid: "name"},
        {name: "ROLE", uid: "role"},
        {name: "URMARITORI", uid: "followers"},
        {name: "ACTIONS", uid: "actions"},
    ];

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const {search} = useParams();
    const [searchTerm, setSearchTerm] = useState(search);
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(9);

    const handleSearch = async () => {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API}/api/user/search?search=${search}&&page=${page}`,{
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
        });
        const json = await response.json();

        if(response.ok){
            console.log(json);
            setResults(json);
            setLoading(false);
        }
        if(!response.ok){
            console.log(json.error);
        }
     };

    useEffect(() =>{
        if(searchTerm)
            handleSearch();
    }, [page])


    if(!search){
        return <NotFound/>
    }
    return (
        <div className="container mx-auto h-screen w-screen my-5 p-3 relative z-40">
            {loading && (
                <Loading/>
            )}
            <Tabs className="flex flex-col">
                <Tab title="Users">
                    <Table bottomContent={
                        <div className="flex w-full justify-center">
                        <Pagination
                            initialPage={1}
                            showControls
                            showShadow
                            loop
                            color="primary"
                            page={page}
                            size="lg"
                            total={Math.ceil(results?.totalUsers/10)}
                            onChange={(page) => setPage(page)}
                        />
                        </div>
                    }>
                        <TableHeader>
                            <TableColumn>
                                NUME
                            </TableColumn>
                            <TableColumn>
                                STATUT
                            </TableColumn>
                            <TableColumn>
                                URMARITORI
                            </TableColumn>
                            <TableColumn>
                                <div style={{textAlign:'end'}}>
                                    ACTIUNI
                                </div>
                            </TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={`Cautarea ta, ${search.length > 20 ? search.substring(0, 20) + '...' : search}, nu a returnat niciun document.`}>
                            {results.users?.map((user, index) => (
                                <TableRow key={index}>
                                   <TableCell>
                                        <User onClick={() => navigate(`/profile/${user.username}`)} style={{cursor:'pointer'}}
                                            avatarProps={{radius: "lg", src: user.avatar}}
                                            description={user.username}
                                            name={user.displayName}
                                        >
                                            {user.username}
                                        </User>
                                   </TableCell>
                                   <TableCell>
                                        <div className="flex flex-col">
                                            <p className="text-bold text-sm capitalize">{user.statut}</p>
                                        </div>
                                   </TableCell>
                                   <TableCell>
                                        <div className="flex flex-col">
                                            <p className="text-bold text-sm capitalize pl-7"> nyet</p>
                                        </div>
                                   </TableCell>
                                   <TableCell>
                                    <div className="relative flex justify-end items-center gap-2">
                                        <Dropdown>
                                        <DropdownTrigger>
                                            <Button isIconOnly size="sm" variant="light">
                                            <VerticalDotsIcon className="text-default-300" />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu>
                                            <DropdownItem>Report</DropdownItem>
                                            <DropdownItem>Follow</DropdownItem>
                                            <DropdownItem>Message</DropdownItem>
                                        </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                   </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Tab>
                <Tab title="Clase">
                    {/* <Table>
                        <TableHeader>
                            <TableColumn>Title</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data.getSearch.problems.map((problem, index) => (
                                <TableRow key={index}>
                                   <TableCell>
                                        <Link to={`/problems/${problem}`}>{problem}</Link>
                                   </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table> */}
                </Tab>
                <Tab title="Materiale">
                    {/* <Table>
                        <TableHeader>
                            <TableColumn>Title</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data.getSearch.articles.map((article, index) => (
                                <TableRow key={index}>
                                   <TableCell>
                                        <Link to={`/articles/${article}`}>{article}</Link>
                                   </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table> */}
                </Tab>
                <Tab title="Concursuri">
                    {/* <Table>
                        <TableHeader>
                            <TableColumn>Title</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data.getSearch.contests.map((contest, index) => (
                                <TableRow key={index}>
                                   <TableCell>
                                        <Link to={`/contests/${contest}`}>{contest}</Link>
                                   </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table> */}
                </Tab>
            </Tabs>
        </div>  
    );
}
 
export default Search;