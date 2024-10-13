import React, { forwardRef, useImperativeHandle } from 'react'

const Child = forwardRef((props, ref) => {
  // This function will be triggered from App
  const handleOpen = () => {
    console.log("open from Child");
  }

  // Expose handleOpen to be callable from the parent component
  useImperativeHandle(ref, () => ({
    handleOpen,
  }));

  return (
    <div>Child</div>
  );
});

export default Child;
