// src/App.tsx
import { useEffect, useState } from 'react';
import { 
  Container, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  AppBar, 
  Toolbar,
  CircularProgress,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid // Klasik Grid (Her sürümde çalışır)
} from '@mui/material';

// TİP TANIMLAMALARI İÇİN AYRI IMPORT (SelectChangeEvent Hatasını Çözer)
import type { SelectChangeEvent } from '@mui/material';

import { getProducts } from './services/api';
import type { Product } from './types';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = ["all", ...new Set(products.map(p => p.category))];

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value as string);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6">React E-Ticaret</Typography>
        </Toolbar>
      </AppBar>

      <Container>
        {/* Filtreleme Alanı */}
        {/* Klasik Grid Kullanımı: 'container' ekliyoruz */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          
          {/* Arama Kutusu */}
          {/* Klasik Grid Kullanımı: 'item' ekliyoruz ve xs/md veriyoruz */}
          <Grid item xs={12} md={8}>
            <TextField 
              fullWidth 
              label="Ürün Ara..." 
              variant="outlined" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>

          {/* Kategori Seçimi */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Kategori</InputLabel>
              <Select
                labelId="category-select-label"
                value={selectedCategory}
                label="Kategori"
                onChange={handleCategoryChange}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

        </Grid>

        {/* Ürün Listesi */}
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            // Klasik Grid Kullanımı
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.title}
                  sx={{ objectFit: "contain", p: 2 }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.category}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {product.price} TL
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          {filteredProducts.length === 0 && (
            <Typography variant="h6" color="text.secondary" sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
              Aradığınız kriterlere uygun ürün bulunamadı.
            </Typography>
          )}
        </Grid>
      </Container>
    </>
  );
}

export default App;