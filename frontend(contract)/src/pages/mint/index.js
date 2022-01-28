
import React from 'react';
import { Button, makeStyles, TextField } from '@material-ui/core';
import FileUpload from 'react-material-file-upload';
import styles from './style';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
const useStyles = makeStyles(styles);

const Quantity = (props) => {
  const classes = useStyles();
  const { quantity, setQuantity } = props;
  return (
    <div className={classes.quantity}>
      <Button variant="contained" onClick={() => setQuantity(quantity - 1)} disabled={quantity === 1}>-</Button>
      <span>{quantity}</span>
      <Button variant="contained" onClick={() => setQuantity(quantity + 1)}>+</Button>
    </div>
  )
}

function MintPage() {
  const classes = useStyles();
  const [files, setFiles] = React.useState([]);
  const [nftType, setNftType] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);

  return (
    <>
      <div className={classes.hero}>
        <img src="/images/mint_logo.png" alt="" />
        <div className={classes.infos}>
          <span>Title</span>
          <TextField
            placeholder="Hall of fame"
            variant="filled"
          />
          <span>Description</span>
          <TextField
            placeholder="A description about your NFT"
            variant="filled"
            multiline
            rows={4}
          />
          <div id="toggles">
            <div>
              <span>NFT Type</span>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={nftType}
                onChange={(e, v) => v !== null ? setNftType(v) : ''}
              >
                <ToggleButton value={0}>ERC721</ToggleButton>
                <ToggleButton value={1}>ERC1155</ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div>
              <span>Quantity</span>
              <Quantity quantity={quantity} setQuantity={setQuantity} />
            </div>
          </div>
          <span>Social Media URL (Optional)</span>
          <TextField
            placeholder="https://twitter.com/example"
            variant="filled"
          />
          <Button id="submit" variant="contained">
            Submit
          </Button>
        </div>
        <div className={classes.vertical_line} />
        <FileUpload
          accept={['image/jpeg', 'image/png', 'video/mp4']}
          title="JPG, PNG or MP4 videos accepted. 10MB limit."
          buttonText="Click to upload"
          maxSize={1024*1024*10}
          value={files}
          onChange={setFiles}
        />
        <Button id="submit" variant="contained">
          Submit
        </Button>
      </div>
    </>
  );
}

export default MintPage;