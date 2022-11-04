//Student: Hoda Masteri
import React, { useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import UserBar from "./user/UserBar";
import TodoList from "./todo/TodoList";
import CreateTodo from "./todo/CreateTodo";
import { useEffect } from "react";
import { useResource } from "react-request-hook";

import appReducer from "./reducer";
import { StateContext } from "./contexts";

function App() {
  const initialTodos = [];

  const [state, dispatch] = useReducer(appReducer, {
    user: "",
    todoitems: initialTodos,
  });

  const { user } = state;

  useEffect(() => {
    if (user) {
      document.title = `${user}’s to-do list`;
    } else {
      document.title = "To-do list";
    }
  }, [user]);

  // useEffect(() => {
  //   fetch("/api/todoitems")
  //     .then((result) => result.json())
  //     .then((todoitems) => dispatch({ type: "FETCH_TODOITEMS", todoitems }));
  // }, []);

  const [todoitems, getTodoitems] = useResource(() => ({
    url: "/todoitems",
    method: "get",
  }));

  useEffect(getTodoitems, []);

  useEffect(() => {
    if (todoitems && todoitems.data) {
      dispatch({
        type: "FETCH_TODOITEMS",
        todoitems: todoitems.data.reverse(), // reverse to show the sorted todoitems
      });
    }
  }, [todoitems]);

  return (
    <div>
      <StateContext.Provider value={{ state, dispatch }}>
        <React.Suspense fallback={"Loading..."}>
          <UserBar />
        </React.Suspense>
        <TodoList />
        {state.user && <CreateTodo />}
      </StateContext.Provider>
    </div>
  );
}

export default App;
