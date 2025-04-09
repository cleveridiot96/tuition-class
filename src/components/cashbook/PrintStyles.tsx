
import React from "react";

const PrintStyles = () => {
  return (
    <style>{`
      @media print {
        body * {
          visibility: hidden;
        }
        .print-header {
          display: block !important;
        }
        #printRef, #printRef * {
          visibility: visible;
        }
        #printRef {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
      .dropdown {
        position: relative;
        display: inline-block;
      }
      .dropdown-content {
        display: none;
        position: absolute;
        right: 0;
      }
      .dropdown:hover .dropdown-content {
        display: block;
      }
    `}</style>
  );
};

export default PrintStyles;
