import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useGetCustomersQuery, useGetDiscountQuery } from "state/api";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { TextField, Button, Stack } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import axios from "axios";

const CustomerCare = () => {
  const theme = useTheme();

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const { data, isLoading, refetch } = useGetCustomersQuery("customerSupport");

  const [addCustomerCare, setAddCustomerCare] = useState(false);

  const genderType = [
    {
      value: "M",
      label: "Male",
    },
    {
      value: "F",
      label: "Female",
    },
    {
      value: "O",
      label: "Other",
    },
  ];

  const staffType = [
    {
      value: "customerSupport",
      label: "Customer Support",
    },
    {
      value: "admin",
      label: "Admin",
    },
  ];

  const [customerCareData, setCustomerCareData] = useState({
    firstName: "",
    lastName: "",
    gender: "M",
    email: "",
    userRole: "customerSupport",
    cnicNumber: "",
    phoneNumber: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const data = {
      firstName: customerCareData.firstName,
      lastName: customerCareData.lastName,
      gender: customerCareData.gender,
      email: customerCareData.email,
      userRole: customerCareData.userRole,
      cnicNumber: customerCareData.cnicNumber,
      phoneNumber: customerCareData.phoneNumber,
    };

    await axios
      .post(`${localStorage.getItem("baseUrl")}admin/users`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        alert("Customer Care added successfully");
        setCustomerCareData({
          firstName: "",
          lastName: "",
          gender: "M",
          email: "",
          userRole: "customerSupport",
          cnicNumber: "",
          phoneNumber: "",
        });
        setAddCustomerCare(false);
        refetch();
      })
      .catch((err) => {
        console.log(err);
        alert(err?.response?.data?.message);
      });

    // window.location.reload();
  }

  const reformedData = data?.data?.users?.map((item) => {
    return {
      _id: item.id,
      fullName: item.fullName,
      email: item.email,
      phoneNumber: item.phoneNumber,
      status: item.status,
      gender: item.gender,
      createdAt: item.createdAt,
    };
  });

  const handleDeleteClick = (params) => {
    console.log(params.row);
    axios
      .delete(
        `${localStorage.getItem("baseUrl")}admin/discount-codes/` +
          params.row._id
      )
      .then((res) => {
        console.log(res);
        console.log(res.data);
      });

    window.location.reload();
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
      editable: true,
    },
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      flex: 1,
      cellClassName: "actions",

      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(params)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Customer Care"
        subtitle="Entire list of Customer Care team"
      />
      <Button
        variant="outlined"
        color="secondary"
        type="submit"
        sx={{ mt: "1rem" }}
        onClick={() =>
          setAddCustomerCare((prev) => (prev === false ? true : false))
        }
      >
        Add Customer Care
      </Button>

      {addCustomerCare === true && (
        <Box>
          <React.Fragment>
            <h2>Create CustomerCare Code</h2>
            <form onSubmit={handleSubmit} action={<Link to="/login" />}>
              <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                <TextField
                  type="text"
                  variant="outlined"
                  color="secondary"
                  label="First Name"
                  onChange={(e) =>
                    setCustomerCareData({
                      ...customerCareData,
                      firstName: e.target.value,
                    })
                  }
                  value={customerCareData.firstName}
                  fullWidth
                  required
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="secondary"
                  label="Last Name"
                  onChange={(e) =>
                    setCustomerCareData({
                      ...customerCareData,
                      lastName: e.target.value,
                    })
                  }
                  value={customerCareData.lastName}
                  fullWidth
                  required
                />
              </Stack>

              <Stack>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Gender"
                  defaultValue={customerCareData.gender}
                  sx={{ mb: 4, mr: 2 }}
                  onChange={(e) =>
                    setCustomerCareData({
                      ...customerCareData,
                      gender: e.target.value,
                    })
                  }
                >
                  {genderType.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  id="outlined-select-currency"
                  select
                  label="Role"
                  defaultValue={customerCareData.userRole}
                  sx={{ mb: 4, mr: 2 }}
                  onChange={(e) =>
                    setCustomerCareData({
                      ...customerCareData,
                      userRole: e.target.value,
                    })
                  }
                >
                  {staffType.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Stack>
                <TextField
                  type="text"
                  variant="outlined"
                  color="secondary"
                  label="Email"
                  sx={{ mb: 4, mr: 2 }}
                  onChange={(e) =>
                    setCustomerCareData({
                      ...customerCareData,
                      email: e.target.value,
                    })
                  }
                  value={customerCareData.email}
                  fullWidth
                  required
                />

                <TextField
                  type="text"
                  variant="outlined"
                  color="secondary"
                  label="CNIC Number"
                  sx={{ mb: 4, mr: 2 }}
                  onChange={(e) =>
                    setCustomerCareData({
                      ...customerCareData,
                      cnicNumber: e.target.value,
                    })
                  }
                  value={customerCareData.cnicNumber}
                  fullWidth
                  required
                />

                <TextField
                  type="text"
                  variant="outlined"
                  color="secondary"
                  label="Phone Number"
                  sx={{ mb: 4, mr: 2 }}
                  onChange={(e) =>
                    setCustomerCareData({
                      ...customerCareData,
                      phoneNumber: e.target.value,
                    })
                  }
                  value={customerCareData.phoneNumber}
                  fullWidth
                  required
                />
              </Stack>
              <Button variant="outlined" color="secondary" type="submit">
                Submit
              </Button>
            </form>
            <small>
              {/* Already have an account? <Link to="/login">Login Here</Link> */}
            </small>
          </React.Fragment>
        </Box>
      )}

      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={reformedData && reformedData.length > 0 ? false : true}
          getRowId={(row) => row._id}
          rows={
            (reformedData && reformedData.length > 0 ? reformedData : []) || []
          }
          columns={columns}
          rowCount={(reformedData && reformedData.length) || 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                driverPhoneNumber: false,
                createdAt: false,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default CustomerCare;
