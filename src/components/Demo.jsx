import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import { TransitionGroup } from "react-transition-group";
import {
  Divider,
  Fade,
  FormControl,
  Grow,
  InputLabel,
  ListItemButton,
  MenuItem,
  Select,
  Slide,
  Zoom,
} from "@mui/material";
import axios from "axios";
import { QueryErrorResetBoundary, useQuery } from "@tanstack/react-query";
import Demo2 from "./Demo2";
import { ErrorBoundary } from "react-error-boundary";

export const getUserById = async (param) => {
  const { queryKey, signal } = param;
  try {
    const { data } = await axios("https://jsonplaceholder.typicode.com/users/" + queryKey[1], { signal });
    return data;
  } catch (error) {
    throw error;
  }
};

const FRUITS = ["🍏 Apple", "🍌 Banana", "🍍 Pineapple", "🥥 Coconut", "🍉 Watermelon"];

function renderItem({ item, handleRemoveFruit }) {
  return (
    <ListItem
      dense
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          title="Delete"
          size="small"
          color="warning"
          disableRipple
          onClick={() => handleRemoveFruit(item)}>
          <DeleteIcon />
        </IconButton>
      }>
      <ListItemButton dense>
        <ListItemText primary={item} />
      </ListItemButton>
    </ListItem>
  );
}

export default function TransitionGroupExample({ userId }) {
  const [fruitsInBasket, setFruitsInBasket] = React.useState(FRUITS.slice(0, 3));

  const { data } = useQuery({
    queryKey: ["userById", userId],
    queryFn: getUserById,
    enabled: !!userId,
  });

  const handleAddFruit = () => {
    const nextHiddenItem = FRUITS.find((i) => !fruitsInBasket.includes(i));
    if (nextHiddenItem) {
      setFruitsInBasket((prev) => [nextHiddenItem, ...prev]);
    }
  };

  const handleRemoveFruit = (item) => {
    setFruitsInBasket((prev) => [...prev.filter((i) => i !== item)]);
  };

  const addFruitButton = (
    <Button variant="contained" disabled={fruitsInBasket.length >= FRUITS.length} onClick={handleAddFruit}>
      Add fruit to basket
    </Button>
  );

  return (
    <>
      <Box maxWidth={350} textAlign={"center"} justifyContent={"center"} margin={"auto"} mt={5}>
        {/* {addFruitButton}
        <Box sx={{ mt: 1, p: 1, background: "linear-gradient(23deg, #ff000025 0%, #0000ff25 100%)" }}>
          <List dense sx={{ backgroundColor: "#eeeeee25" }}>
            {fruitsInBasket.map((item) => (
              <div key={item}> {renderItem((item, handleRemoveFruit))}</div>
            ))}
          </List>
        </Box> */}
        {JSON.stringify(data)}
      </Box>
      <Divider />
      <Box sx={{ minHeight: 300 }}>
        <React.Suspense fallback={<div>Loading demo2...</div>}>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                fallbackRender={({ resetErrorBoundary }) => (
                  <div>
                    There was an error!
                    <Button onClick={() => resetErrorBoundary()}>Try again</Button>
                  </div>
                )}>
                <Demo2 />
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </React.Suspense>
      </Box>
    </>
  );
}
