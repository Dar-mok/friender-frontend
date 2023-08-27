import { useState, useEffect, useContext } from "react";
// import { Navigate } from "react-router-dom";
// import SearchForm from "./SearchForm";
import FrienderApi from "./api";
import userContext from "./userContext";


/** This Matches component will display 1) on the left side of the screen, all
 *  the current matches (the username of the match, maybe firstName). And 2) On
 *  the right side of the screen will be a message area and a field to send a
 * message.*/

// this function receives user(or grabs if from context)---
function Matches(){
  // const { user } = useContext(userContext);
  const { username } = useContext(userContext);

  /**  piece of state to hold the matches (needed so that after the useEffect
  grabs all the matches the page will reload ) --will end up rendering
  individual match cards*/
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  /** piece of state (needed?) to hold all the messages. --will end up
   * rendering individual message cards */

  // const [viewedMatch, setViewedMatch] = useState("");

  /** --SCRATCH ABOVE-- Dont need state to hold all the messages. Instead
   * have a piece of state that hold the currently selected user from the
   * matches side as a refernce to what messages should be pulled and shown on
   *  the right side of the screen
  */

  //useEffect will run after initial rendering and grab all the matches to this
  //user and save them to matches State. useEffect dep.array = [matches, viewMatch]
  //
  useEffect(()=>{
    async function getMatches(){
      if(isLoading) {
        const allMatches = await FrienderApi.getUserMatches(username);
        console.log("allmatches is", allMatches)
        setMatches(allMatches);
        setIsLoading(false);
      }
      // if (viewedMatch !== ""){
      //   const allMessages = await FrienderApi.getMessages(user.username, viewedMatch.username);
      //   setMessages(allMessages);
      // }
    }
    getMatches();
  }, []) //add viewedMatch to state to display messages

  //FINISH THIS
  // function getMessages(){
  //   const messageComponents= messages.map(message=>{
  //     return (
  //       <div>
  //         <h3>{message.message}</h3>
  //       </div>
  //     )
  //   })
  // }
  function showMatches(){
    const thematches= matches.map(mtchObj=>{
      return (
        <div className="text-dark" key={mtchObj.viewUser}>
          <h2>testing</h2>
          <h2>{mtchObj.viewUser}</h2>
          {/* <h2>{mtchObj.hobbies}</h2> */}
        </div>
      )
    })
    return thematches
  }

  if (isLoading) return <h1 className="position-absolute top-50 start-50 text-dark">Loading....</h1>;
    //Matches left side

    //Messages right side
    //There will be no messages at first, so a simple display of "Messages Here",
    //Then when a match on the right side is clicked, whoever that match is,
    //grab their username and retrieve all the messages
  return (
    <div className="container-fluid">
    <div className="row">
      <div className="col-lg-3">
        {/* Content for the left side */}
        {showMatches()}
      </div>
      <div className="col-lg-9">
        {/* Content for the right side */}
        {/* {getMessages()} */}
        {/* {messageComponents.length < 1 && <h3>A space for messages...</h3>   } */}
      </div>
    </div>
  </div>
  );
}
export default Matches;
