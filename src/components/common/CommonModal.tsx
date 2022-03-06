import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { useRef } from 'react';


function PaperComponent(props: PaperProps) {
  const nodeRef = useRef(null);
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={nodeRef}
    >
      <Paper  ref={nodeRef} {...props} />
    </Draggable>
  );
}

export default function CommonModal(props:{
  showModal:boolean, 
  selectedIndx: number,
  title: string, 
  contents: string, 
  clickOkHandle: Function,
  clickCancelHandle: Function
}) {
  
    return (
      <div>
        <Dialog
          open={props.showModal}
          onClose={() => {props.clickCancelHandle()}}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        
        >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            {props.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {props.contents}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => {props.clickOkHandle(props.selectedIndx)}}>확인</Button>
            <Button  onClick={() => {props.clickCancelHandle()}}>
              취소
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }