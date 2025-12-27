import React from 'react'
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import dayjs from 'dayjs'
import BoardBar from "./Board Bar/BoardBar";
import AppBar from "../../components/Appbar/Appbar";
import BoardContent from "./Board Content/BoardContent";
import Footer from '../../components/Footer/Footer'

function BoardsPage() {
  // Lifted search state so BoardBar and BoardContent can share filters
  const [checkInDate, setCheckInDate] = React.useState(dayjs());
  const [checkOutDate, setCheckOutDate] = React.useState(dayjs().add(1, 'day'));
  const [adults, setAdults] = React.useState(1);
  const [children, setChildren] = React.useState(0);

  // filters object applied when user clicks Tìm Phòng
  const [filters, setFilters] = React.useState(null);

  const handleSearch = () => {
    setFilters({ checkInDate, checkOutDate, adults, children });
  }

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: "100vh", backgroundColor: "white" }}
    >
      <AppBar />
      <BoardBar
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
      <BoardContent filters={filters} />
      <Footer />
    </Container>
  );
}

export default BoardsPage;
