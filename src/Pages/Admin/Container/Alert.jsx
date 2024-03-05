import React from "react";

const Alert = (props) => {
 
  return (
    <>
      {props.alert && (
        <div className="flex justify-center  absolute w-full">
                <div
            className={`bg-${props.alert.type}-500 transition-opacity  w-3/6 left-49 p-4   top-0  text-white rounded-md`}
          >
            <h2 className="text-bold">{props.alert.message} </h2>
          </div>
        </div>
      )}
    </>
  );
};

export default Alert;
