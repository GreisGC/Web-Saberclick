import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Paper } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description'; 
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'; 
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';

const TemaCards = ({ id_tutoria }) => {

  const [listaTemas, setListaTemas] = useState([]);
  const [titulo, setTitulo] = useState('');

  const getTemas = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    console.log('Obteniendo temas para tutoria:', id_tutoria);
    fetch(`http://localhost:4000/temaPorTutoria/${id_tutoria}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('Temas obtenidos:', result);
        setListaTemas(result?.contenido?.archivos ?? []);
        setTitulo(result?.titulo ?? '');
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (id_tutoria) getTemas();
  }, [id_tutoria]);

  const getFileNameFromUrl = (url) => {
    if (!url) return 'Archivo Desconocido';
    const lastSlash = url.lastIndexOf('/');
    let fileName = url.substring(lastSlash + 1);
    try {
      fileName = decodeURIComponent(fileName);
    } catch (e) { }
    return fileName;
  };

  const isContentAvailable = listaTemas.length > 0 || titulo;

  return (
    <Paper 
      elevation={6} 
      sx={{ p: 3, mb: 4, borderRadius: 2, borderLeft: '5px solid #3f51b5', backgroundColor: '#ffffff' }}
    >
      <Typography variant="h5" fontWeight="bold" color="primary.dark" sx={{ mb: 2, pb: 1 }}>
        📚 Material Adjunto: {titulo || 'Temas'}
      </Typography>

      {!isContentAvailable ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          No se encontró material disponible.
        </Typography>
      ) : (
        <List dense>
          {listaTemas.map((url, index) => {
            const fileName = getFileNameFromUrl(url);
            const isPDF = url.toLowerCase().includes('.pdf');
            const isVideo = !isPDF && url.toLowerCase().includes('http'); 
            const IconComponent = isPDF ? PictureAsPdfIcon : (isVideo ? PlayCircleFilledIcon : DescriptionIcon);
            const iconColor = isPDF ? 'error' : (isVideo ? 'primary' : 'action');

            return (
              <React.Fragment key={index}>
                <ListItem 
                  component="a" 
                  href={url} 
                  target='_blank' 
                  rel="noopener noreferrer"
                  disableGutters 
                  sx={{ py: 1.5, px: 1, cursor: 'pointer', transition: 'background-color 0.2s', '&:hover': { backgroundColor: '#e3f2fd' } }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <IconComponent color={iconColor} fontSize="medium" />
                  </ListItemIcon>

                  <ListItemText 
                    primary={fileName} 
                    primaryTypographyProps={{ fontWeight: 'medium', color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    secondary={isPDF ? 'Documento PDF' : 'Enlace/Video Externo'}
                    secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                  />

                  <ListItemIcon sx={{ minWidth: 40, ml: 2 }}>
                    <DownloadIcon color="action" />
                  </ListItemIcon>
                </ListItem>
                {index < listaTemas.length - 1 && <Divider component="li" />}
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default TemaCards;
