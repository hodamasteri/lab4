//Student: Hoda Masteri
import TodoItem from "./TodoItem";
import { useContext, useEffect } from "react";
import { StateContext } from "../contexts";
import { useResource } from "react-request-hook";

export default function TodoList() {
  const { state, dispatch } = useContext(StateContext);
  const { todoitems } = state;

  const [todo, updatetodo] = useResource(({ id, complete, dateCompleted }) => ({
    url: "/todoitems/" + String(id),
    method: "patch", // put was deleting other props so I had to use patch instead for partial update
    data: { complete, dateCompleted },
  }));

  useEffect(() => {
    if (todo?.isLoading === false && todo?.data) {
      dispatch({
        type: "TOGGLE_TODO",
        id: todo.data.id,
        complete: todo.data.complete,
        dateCompleted: todo.data.dateCompleted,
      });
    }
  }, [todo]);

  const [todotoremove, deletetodo] = useResource(({ id }) => ({
    url: "/todoitems/" + String(id),
    method: "delete",
  }));

  return (
    <div>
      {todoitems.map((item, i) => {
        return (
          <div>
            <TodoItem {...item} key={item.id} />
            <input
              type="checkbox"
              checked={item.complete}
              onChange={() => {
                updatetodo({
                  id: item.id,
                  complete: !item.complete,
                  dateCompleted: !item.complete
                    ? Date(Date.now()).toString()
                    : "",
                });
              }}
            />
            <input
              type="button"
              value="Remove from list?"
              disabled={item.complete === false}
              onClick={(e) => {
                e.preventDefault();
                deletetodo({ id: item.id });
                dispatch({ type: "DELETE_TODO", id: item.id });
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
