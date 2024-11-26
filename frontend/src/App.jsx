import { useState } from 'react'
import axios from 'axios'


//https://dog.ceo/api/breeds/image/random
function App() {

  const [imgUrl, setImageUrl] = useState('')
  const [err, setError] = useState('')

  async function makeAnAPIRequest() {
    setError('');
    let response = await axios.get('https://randombig.cat/roar.json');
    setImageUrl(response.data.url)

    // .then(function(response) {
      //   console.log(response)
      //   console.log("This request went well")
      //   setImageUrl(response.data.url);
      //   //console.log("URL Response", response.data.url);
      // })
      // .catch(function(errorResponse) {
      //   console.log("SOmething went wrong")
      //   setError("There was an error making the request.  Please try again");
      // })

    // axios.get('https://dog.ceo/api/breeds/image/random')
    //   .then(function(response) {
    //     setDogImage(response.data.message);
    //   })

  }

  return (
    <div>
      <div>
        Hello, click to generate a cat image
      </div>
      <button onClick={makeAnAPIRequest}>
        Generate
      </button>
      {err ? err : null}
      {imgUrl ? <img src={imgUrl} height={600} width={600}/> : null}

    </div>
  )
  // const [dogImage, setDogImage] = useState('')

  // function getDogImageAsPromise() {
  //   console.log("hello from line 13")
  //   axios.get("https://dog.ceo/api/breeds/image/random")
  //     .then(function(response) {
  //       console.log("hello from line 16")
  //       setDogImage(response.data.message)
  //     })
  //   console.log("hello from line 19")
  // }

  // // async function getDogImageAsAsyncAwait() {
  // //   const response = await axios.get("https://dog.ceo/api/breeds/image/random")
  // //   setDogImage(response.data.message);
  // // }


  // return (
  //   <div>
  //     <div>
  //       Hello from my dog picture app
  //     </div>
  //     <button onClick={getDogImageAsPromise}>
  //       Click here to get a dog image
  //     </button>
  //     {dogImage && <img src={dogImage} />}
  //   </div>
  // )
}

export default App
