import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  IconButton,
  Menu,
  MenuItem as MUIMenuItem,
  Typography,
} from '@mui/material';
import { MoreVert, Category } from '@mui/icons-material';

const categoryColors = {
  Food: '#FF7043',
  Transport: '#29B6F6',
  Salary: '#66BB6A',
  'Pocket Money': '#AB47BC',
  Lending: '#FFCA28',
  Entertainment: '#EF5350',
  Shopping: '#8D6E63',
  Bills: '#42A5F5',
  Healthcare: '#D4E157',
  Other: '#BDBDBD',
};

export default function FilteredTransactions({
  expenses,
  categoryIcons,
  handleMenuOpen,
  handleMenuClose,
  handleEdit,
  handleDelete,
  anchorEl,
  menuExpId
}) {
  return (
    <Paper sx={{ p: 3 }}>
      <List>
        {expenses.map((exp) => {
          const icon = categoryIcons[exp.category] || <Category />;
          const date = new Date(exp.date.seconds * 1000);
          const formattedDate = date.toLocaleDateString('en-GB');
          const isIncome = exp.type === 'income';

          return (
            <ListItem
              key={exp.id}
              sx={{
                px: 1,
                pr: { xs: 1, sm: 15 },
                py: 1.5,
                borderBottom: '1px solid #eee',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 1, sm: 0 }
              }}
              secondaryAction={
                <IconButton edge="end" onClick={(e) => handleMenuOpen(e, exp.id)}>
                  <MoreVert />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: categoryColors[exp.category] || '#ccc', color: '#fff' }}>
                  {icon}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    width="100%"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    gap={{ xs: 1, sm: 0 }}
                  >
                    {/* Left Side */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      flex="1"
                      minWidth={0}
                    >
                      <Typography fontWeight="bold">{exp.category}</Typography>
                      {exp.note && (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ opacity: 0.7, wordBreak: 'break-word' }}
                        >
                          {exp.note}
                        </Typography>
                      )}
                    </Box>

                    {/* Right Side */}
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={{ xs: 'space-between', sm: 'flex-start' }}
                      sx={{ gap: 2, minWidth: { sm: 150 } }}
                      width={{ xs: '100%', sm: 'auto' }}
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ minWidth: '85px', textAlign: 'left' }}
                      >
                        {formattedDate}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={isIncome ? 'green' : 'red'}
                        sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}
                      >
                        {isIncome ? '+' : '-'}₹{exp.amount}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          );
        })}
      </List>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MUIMenuItem
          onClick={() => {
            handleEdit(menuExpId);
            handleMenuClose();
          }}
        >
          Edit
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            handleDelete(menuExpId);
            handleMenuClose();
          }}
        >
          Delete
        </MUIMenuItem>
      </Menu>
    </Paper>
  );
}