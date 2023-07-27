import axios from 'axios'
import readline from 'readline'

const stdInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const OGSapi = {
    Omnisearch: 'https://online-go.com/api/v1/ui/omniSearch?q=',
    players: 'https://online-go.com/api/v1/players/',
    username: '?username=',
    games: 'https://online-go.com/api/v1/games/',
    demos: 'https://online-go.com/api/v1/demos/',
    page: '?page='

}
const searchInput = 'Tang'
// console.log(`${OGSapi.players}${OGSapi.username}${searchInput}`)
// axios.get(`${OGSapi.players}${OGSapi.username}${searchInput}`)
//     .then(response => {
//         console.log(response.data)
//     })
//     .catch(error => {
//         console.log(error)
//     })

const SearchOGSUsername = async (username) => {
    try {
        const response = await axios.get(`${OGSapi.players}${OGSapi.username}${username}`);
        if(response.data.username != username){
            return 'not found'
        }
        return response.data;
    } catch (error) {
        return 'not found';
    }
};

const SearchOGSByCharacters = async (characters) => {
    axios.get(`${OGSapi.Omnisearch}${characters}`)
        .then(response => {
            const players = response.data.players
            console.log(players)
        })
        .catch(error =>{
            console.log(error)
        })
};

const SearchForPlayer = async () => {
    const name = await new Promise((resolve) => {
        stdInterface.question('Enter the name of the player: ', (name) => {
            stdInterface.close();
            resolve(name);
        });
    });

    const returnedItem = await SearchOGSUsername(name);
    if (returnedItem === 'not found') {
        const usernames = await SearchOGSByCharacters(name);
        console.log(usernames);
    } else {
        console.log(returnedItem);
    }
};

SearchForPlayer();
