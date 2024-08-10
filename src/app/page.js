'use client'
import { useState, useEffect } from "react";
import { Box, Button, Modal, Stack, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, InputAdornment } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });

    setInventory(inventoryList);
  };

  const removeItem = async (itemName) => {
    const docRef = doc(firestore, 'inventory', itemName);
    await deleteDoc(docRef);
    await updateInventory();
  };

  const addItem = async () => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await setDoc(docRef, { quantity: docSnap.data().quantity + quantity });
    } else {
      await setDoc(docRef, { quantity });
    }
    await updateInventory();
    setItem('');
    setQuantity(1);
    handleClose();
  };

  const editItem = async () => {
    const docRef = doc(firestore, 'inventory', editing.name);
    if (quantity < 1) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, { quantity });
    }
    await updateInventory();
    setEditing(null);
    setItem('');
    setQuantity(1);
    handleClose();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setItem(item.name);
    setQuantity(item.quantity);
    handleOpen();
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      alignItems="center"
      bgcolor="#f0f0f0"
      p={4}
      sx={{ bgcolor: 'linear-gradient(135deg, #94a3b8, #d1d5db)' }}
    >
      <Typography variant="h2" gutterBottom>
        InventoryHub
      </Typography>
      <Box display="flex" alignItems="center" mb={2} width="80%">
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#1976d2',
              }
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            marginLeft: 2,
            bgcolor: 'green',
            '&:hover': {
              bgcolor: '#155a9a'
            },
            borderRadius: 2
          }}
        >
          Add Item +
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          width: '80%',
          maxHeight: '60vh',
          borderRadius: 2,
          boxShadow: 4
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': {
                    bgcolor: '#f1f1f1'
                  }
                }}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => removeItem(item.name)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius={2}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h4" gutterBottom>
            {editing ? 'Edit Item' : 'Add Item'}
          </Typography>
          <Stack width="100%" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Item Name"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              disabled={!!editing}
              sx={{ bgcolor: '#f9f9f9', borderRadius: 2 }}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              sx={{ bgcolor: '#f9f9f9', borderRadius: 2 }}
            />
            <Button
              variant="contained"
              onClick={editing ? editItem : addItem}
              sx={{
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#155a9a'
                },
                borderRadius: 2
              }}
            >
              {editing ? 'Save Changes' : 'Add Item'}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}