import React from 'react';
import { Typography, Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description'; 
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'; 
import { useContext } from 'react';
import { SesionContext } from '../../../context/SesionContext';
import { useState } from 'react';
import { useEffect } from 'react';


// Datos de ejemplo para el material
const materials = [
  { name: "Lorem ipsum lorem ipsum", type: "document" },
  { name: "Lorem ipsum lorem ipsum", type: "document" },
  { name: "Lorem ipsum lorem ipsum", type: "document" },
  { name: "Lorem ipsum lorem ipsum", type: "document" },
  { name: "Lorem ipsum lorem ipsum", type: "video" },
  { name: "Lorem ipsum lorem ipsum", type: "video" },
];

const TemaCards = () => {
  const { tema } = useContext(SesionContext);
  const [listaTemas, setListaTemas] = useState([]);

  const getTemas = ()=>{
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "text/plain");
  
          const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
          };
  
          fetch("http://localhost:4000/temaPorTutoria/"+tutoria.id_tutoria, requestOptions)
          .then((response) => response.json())
          .then((result) => {
              setListaTemas(result)
          })
          .catch((error) => console.error(error));
      }
      useEffect(()=>{
          getTemas()
      }, [])
    
  return (
    <Box sx={{ p: 2, border: 1, borderColor: 'grey.300', borderRadius: 2, height: '100%' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
        Material
      </Typography>
      <List>
        {materials.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem button sx={{ py: 1 }}>
              <ListItemIcon>
                {item.type === 'document' ? 
                  <DescriptionIcon color="action" fontSize="large" /> : 
                  <PlayCircleFilledIcon color="error" fontSize="large" />
                }
              </ListItemIcon>
              <ListItemText 
                primary={item.name} 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItem>
            {index < materials.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default TemaCards;