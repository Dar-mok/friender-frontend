import { useState, useEffect, useContext } from "react";
// import { Navigate } from "react-router-dom";
import userContext from "./userContext";
import FriendCard from "./FriendCard";
import FrienderApi from "./api";

/** Renders a list of company cards, and a search form
 *
 * Props: None
 *
 * State:
 * - object {isLoading: bool, searchBy: str, companies:[]}
 *
 * Effects:
 * - after first render, send API request for list of companies
 *
 * RoutesList -> CompaniesList -> {SearchForm, CompanyCard}
 */

function FindAFriendList() {
  const { username } = useContext(userContext);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    getFriends();
  }, []);

  async function getFriends() {
    const friendsFromApi = await FrienderApi.getPossibleFriends(username);
    setFriends(friendsFromApi);
    setIsLoading(false);
  }

  function removeInteractedFriend() {
    const copyOfFriends = [...friends];
    copyOfFriends.shift();
    setFriends(copyOfFriends);
  }

  async function likeUser() {
    //add interacting user
    await FrienderApi.likeAUser(username, friends[0]);
    removeInteractedFriend();
  }

  async function dislikeUser() {
    await FrienderApi.dislikeAUser(username, friends[0]);
    removeInteractedFriend();
  }

  /** renderInfo receives nothing, returns instances of the CompanyCard component*/
  function renderFriendCard() {
      return <FriendCard friend={friends[0]} />
    }

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div>
      <h1 className="text-dark">Find-A-Friend!</h1>
      {friends.length > 0 &&(
        <div>
          {renderFriendCard()}
          <button onClick={likeUser} className="btn btn-success">Yes</button>
          <button onClick={dislikeUser} className="btn btn-danger">No</button>
        </div>
      )}
      {friends.length === 0 && (
        <h3 className="text-dark col-6 col mx-auto position-absolute start-50 translate-middle">
          No friends in your area to display!
        </h3>
      )}
    </div>
  );
}

export default FindAFriendList;
