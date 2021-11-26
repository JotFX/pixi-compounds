import { observer } from "mobx-react";
import { RootStore } from "./store/RootStore";
import "./styles.css";
import Paper from "@mui/material/Paper";
import { RenderContainer } from "./view/RenderContainer";
import React from "react";
import { ImageList } from "./view/ImageList";
import {PropertySheet} from "./view/PropertySheet";
import {ElementOverview} from "./view/ElementOverview";
import Typography from "@mui/material/Typography";
import {ErrorToaster} from "./view/ErrorToaster";

export const App = observer(
  (props: { onExport: () => void; store: RootStore }) => {
    return (
      <React.Fragment>
        <ErrorToaster store={props.store} />
        <div className="App">
          <div className="topLeft">
            <RenderContainer />
          </div>

          <div className="bottomLeft" style={{ overflow: "auto" }}>
            <Paper style={{ padding: 20, overflow: "auto" }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
                Available Images
              </Typography>
              <ImageList store={props.store} />
            </Paper>
          </div>
          <div className="topRight" style={{ overflow: "auto" }}>
            <PropertySheet onExport={props.onExport} store={props.store} />
          </div>
          <div className="bottomRight" style={{ overflow: "auto" }}>
            <Paper style={{ height: "100%", overflow: "hidden" }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "left"  }}>
                Element Overview
              </Typography>
              <ElementOverview store={props.store} />
            </Paper>
          </div>
        </div>
      </React.Fragment>
    );
  }
);
