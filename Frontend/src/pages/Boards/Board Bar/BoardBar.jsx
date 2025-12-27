import React from "react";
import Box from "@mui/material/Box";
import HeroTitle from "./HeroTitle";
import SearchBox from "./SearchBox";

const images = [
  "/images/bg7.jpg",
  "/images/bg2.jpg",
  "/images/bg6.jpg",
];

export default function BoardBar({
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  adults,
  setAdults,
  children,
  setChildren,
  onSearch
}) {
  const [rating, setRating] = React.useState(2);
  const [bgIndex, setBgIndex] = React.useState(0);

  // 👉 Tự động đổi background
  React.useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5s đổi ảnh

    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (typeof onSearch === "function") onSearch();
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: (theme) => theme.hotel.boardBarHeight,
        backgroundImage: `url(${images[bgIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 1s ease-in-out",
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          pointerEvents: "none",
        }}
      />

      {/* Nội dung */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          width: "100%",
          maxWidth: 1200,
          pointerEvents: "auto",
        }}
      >
        <HeroTitle rating={rating} setRating={setRating} />

        <SearchBox
          checkInDate={checkInDate}
          setCheckInDate={setCheckInDate}
          checkOutDate={checkOutDate}
          setCheckOutDate={setCheckOutDate}
          adults={adults}
          setAdults={setAdults}
          children={children}
          setChildren={setChildren}
          onSearch={handleSearch}
        />
      </Box>
    </Box>
  );
}
