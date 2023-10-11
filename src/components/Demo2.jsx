import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getUserById } from "./Demo";

const Demo2 = () => {
  const { data,isError,error } = useQuery({
    queryKey: ["userById", 8],
    queryFn: getUserById,
    
  });
  console.log(error,"error",isError)

  if(isError){
    return <div>Something went wrong</div>
  }

  return <div>{JSON.stringify(data)}</div>;
};

export default Demo2;
