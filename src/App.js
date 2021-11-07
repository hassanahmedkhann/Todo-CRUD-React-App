import { useEffect, useState } from "react/cjs/react.development";
import "./App.css";
import db from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "@firebase/firestore";

function App() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [Newname, setnewName] = useState("");
  const [Newdesc, setnewDesc] = useState("");
  const [flag, setflag] = useState(false);
  const [todos, setTodos] = useState([]);
  const todoCollection = collection(db, "todos");
  //When the app loads we need the data to be fetched from the database.
  //The UseEffect runs whenever the app loads and fetches the data from the database.
  useEffect(() => {
    const getTodos = async () => {
      const data = await getDocs(todoCollection);
      setTodos(data.docs.map((doc, i) => ({ ...doc.data(), id: doc.id })));
    };
    getTodos();
  }, [todoCollection]);

  //This is the onClick method taht adds the Data into the Database.
  const addtodo = async (e) => {
    e.preventDefault();

    const items = {
      name: name,
      desc: desc,
    };
    //The add doc function is imported from the firestore database
    //It takes 2 parameters ( 1 bieng hte reference of the database collection we are refering to: Our case is totoCollection, 2 bieng what the data or payload we want to store in the database)
    await addDoc(todoCollection, items);
    setName("");
    setDesc("");
  };

  //This is the UpdateTodo function
  const updateTodo = async (id) => {
    const thedoc = doc(db, "todos", id);
    const newitems = {
      name: Newname,
      desc: Newdesc,
    };
    await updateDoc(thedoc, newitems);
    if (flag === false) {
      setflag(true);
    } else {
      setflag(false);
    }
  };

  function opendiv(e) {
    e.preventDefault();
    console.log("Fired");
    if (flag === false) {
      setflag(true);
    } else {
      setflag(false);
    }
  }

  const deleteTodo = async (id) => {
    const thedoc = doc(db, "todos", id);
    deleteDoc(thedoc);
  };
  return (
    <>
      <div className="app">
        <h1>Todo List App</h1>
        <h3>The App has integrated firebase connectivity.</h3>

        <form onSubmit={addtodo} className="inputs">
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            placeholder="Name"
            type="text"
            className="namebtn"
          />
          <textarea
            value={desc}
            onChange={(event) => {
              setDesc(event.target.value);
            }}
            className="descbtn"
            style={{ fontSize: "20px" }}
            placeholder="Add your Todo"
          />
          <button disabled={(!name, !desc)} type="submit" className="btn">
            Add Todo
          </button>
        </form>

        <div className="bor thelist">
          <table className="thetable">
            <thead>
              <tr>
                <th>Index</th>
                <th>Name</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo, i) => (
                <>
                  <tr key={i} className="thedata">
                    <th>{i + 1}</th>
                    <td>{todo.name}</td>
                    <td>{todo.desc}</td>
                    <td className="btns">
                      <button onClick={opendiv} className="button">
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          deleteTodo(todo.id);
                        }}
                        className="button"
                      >
                        Delete
                      </button>
                    </td>
                    <td>
                      {flag && (
                        <div className="edit">
                          <div className="inputs2">
                            <input
                              onChange={(event) => {
                                setnewName(event.target.value);
                              }}
                              placeholder="Edit Name"
                              type="text"
                              className="editing"
                            ></input>
                            <textarea
                              onChange={(event) => {
                                setnewDesc(event.target.value);
                              }}
                              placeholder="Edit Your Todo"
                              className="editing"
                              type="text"
                            ></textarea>
                            <button
                              onClick={() => {
                                updateTodo(todo.id);
                              }}
                              className="editbtn"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ fontWeight: "700" }} className="footer">
        Copyrights © 2021 Hassan Ahmed Khan | All rights reserved.
      </div>
    </>
  );
}

export default App;
