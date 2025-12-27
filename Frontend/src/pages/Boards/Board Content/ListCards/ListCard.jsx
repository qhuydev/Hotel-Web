import React, { useEffect, useState } from "react";
import { Grid, Box, CircularProgress, Typography } from "@mui/material";
import CardItem from "./Cards/CardItem";
import axios from "axios";

function ListCards({ filters }) {
  const [allRooms, setAllRooms] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_BASE =
      import.meta.env.VITE_API_URL || "http://localhost:8017/api";
    axios
      .get(`${API_BASE}/rooms`)
      .then((res) => {
        const data = res.data.data || [];
        setAllRooms(data);
        setCards(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu:", err);
        setLoading(false);
      });
  }, []);

  // Apply filters when filters change
  useEffect(() => {
    if (!filters) {
      setCards(allRooms);
      return;
    }

    const { adults = 1, children = 0 } = filters;
    const filtered = (allRooms || []).filter((r) => {
      // Some sample rooms may use strings or missing fields; coerce to numbers
      const roomAdults = Number(r.adults ?? 2);
      const roomChildren = Number(r.children ?? 0);
      return roomAdults >= Number(adults) && roomChildren >= Number(children);
    });

    setCards(filtered);
  }, [filters, allRooms]);

  const handleEdit = (roomId) => {
    // Hàm này mở modal chỉnh sửa hoặc redirect sang trang chỉnh sửa
    console.log("Edit room:", roomId);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 2 }}>
      {filters && Array.isArray(cards) && cards.length === 0 && (
        <Typography sx={{ textAlign: 'center', my: 2 }}>Không có phòng phù hợp với yêu cầu.</Typography>
      )}
      <Grid container spacing={4} justifyContent="center">
        {Array.isArray(cards) &&
          cards.map((card) => (
            <Grid item key={card._id} xs={12} sm={6} md={3}>
              <CardItem {...card} onEdit={handleEdit} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}

export default ListCards;
