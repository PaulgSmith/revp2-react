import { DataGrid, GridColDef, GridRowParams} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import React, {useEffect, useReducer, useState} from 'react';
import {Link, Navigate} from "react-router-dom";

import {authAppClient} from "../remote/authenticated-app-client";
import { User } from "../models/user";
import { ReimbursementRequest} from "../models/reimbursement-request";


interface IReimbursementProps{
  currentUser: User | undefined,
  setReimbursementID: (newID: Number) => void
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: .1 , editable: false },
  { field: 'personnel_id', headerName: 'User ID', flex: .1, editable: false },
  { field: 'request_amount', headerName: 'Amount', flex: .1, editable: false },
  { field: 'subject', headerName: 'Subject', flex: .4, editable: false },
  { field: 'request', headerName: 'More Information', flex: .4, editable: false },
  { field: 'status', headerName: 'Status',  flex: .1, editable: false , type: "singleSelect",  valueOptions: [{ value: 0, label: 'Pending' },{ value: 1, label: 'Approved' },{ value: 2, label: 'Rejected' }]},
  { field: 'manager_id', headerName: 'Manager ID', flex: .1, editable: false },
  { field: 'manager_comment', headerName: 'Manager Comment',flex: .4, editable: false },
];

async function fetchReimbursementRequests(): Promise<ReimbursementRequest[]> {
  const response = await authAppClient.get<ReimbursementRequest[]>('http://localhost:3000/reimbursement');
  return response.data;
}

async function postReimbursementRequest(request: ReimbursementRequest): Promise<ReimbursementRequest> {
  const response = await authAppClient.post<ReimbursementRequest>(`http://localhost:3000/reimbursement`, request);
  return response.data;
}

export default function Reimbursements(props: IReimbursementProps) {
  const [rows, setRows] = useState<ReimbursementRequest[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  //minimizing calls to database to retrieve table information
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);


  useEffect(() => {
    async function fetchData() {
      const data = await fetchReimbursementRequests();
      setRows(data);
    }

    fetchData().then();
  }, [ignored]);

  const handleSelectionModelChange = (selectionModel: any) => {
    setSelectedId(selectionModel["id"]);
  };

  const handleDeleteClick = () => {
    authAppClient.delete(`http://localhost:3000/reimbursement/${selectedId}`).then();
    setSelectedId(null);
    forceUpdate();
  };

  function handleUpdateClick(){
    props.setReimbursementID(selectedId!);
  }

  function createNewReimbursement() {
    const new_reimbursement: ReimbursementRequest = {
      id: -1,
      personnel_id: props.currentUser!.user_id,
      request_amount: '0.0',
      subject: 'Update Subject',
      request: 'Update Information',
      status: 0,
      manager_id: 0,
      manager_comment: ''
    }
    postReimbursementRequest(new_reimbursement).then();
    setSelectedId(null);
    forceUpdate();
  }

  const clearClick = () => {
    setSelectedId(null)
  };

  return (
    props.currentUser ?
      <>
        <div style={{ height: 750 , width: '90%', padding: 20}}>

          {(props.currentUser!.user_title === "0") ?
            <>
              <p>{props.currentUser!.name}'s Reimbursements.</p>
              <Button variant="contained" color="primary" onClick={createNewReimbursement}>Create Row</Button></>
            :
              <p>Reimbursements managed by {props.currentUser!.name}'s</p>
           }

          <DataGrid rows={rows} columns={columns} disableColumnMenu  onRowClick = {handleSelectionModelChange} sortModel={[{field: 'id',sort: 'asc',}]} />

          <div>
            {selectedId ? <>
              <Button style={{marginRight: "20px"}} variant="contained" color="primary" onClick={handleDeleteClick}>Delete Reimbursement</Button>
              <Button style={{marginRight: "20px"}} variant="contained" color="primary" onClick={clearClick}>Clear Selection</Button>
              <Button style={{marginRight: "20px"}} variant="contained" color="primary" onClick={handleUpdateClick} component={Link} to="/editreimbursement" >Update</Button> </>
              : <>
              <Button variant="contained" style={{backgroundColor: "#808080", marginRight: "20px"}}>Delete Reimbursement</Button>
              <Button variant="contained" style={{backgroundColor: "#808080", marginRight: "20px"}}>Clear Selection</Button>
              <Button variant="contained" style={{backgroundColor: "#808080", marginRight: "20px"}}>Update</Button>  </>
            }
          </div>
        </div>
      </>
      :
      <>
        <Navigate to="/login"/>
      </>
  );
}
