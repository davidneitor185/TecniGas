import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import {
  Select,
  MenuItem,
  InputBase,
  InputLabel,
  FormControl,
} from "@material-ui/core/";
import { withStyles, makeStyles } from "@material-ui/styles";
import MiFilter from "../../Componentes/MiFilter/Mifilter";
import MiInput from "../../Componentes/MiInput/MiInput";
import useAxios from "../../Hooks/useAxios";
import "./Movimiento.css";
import validarStock from "../../utilidades/validaInventario";
import axios from "axios";
import { notify } from "../../Componentes/notify/Notify";

const Movimiento = ({ recarga, setRecarga }) => {
  const productos = useAxios(`/producto/`);

  const date = new Date();
  const fechaActu = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const [fecha, setFecha] = useState(fechaActu.toISOString().substr(0, 10));
  const [observacion, setObservacion] = useState("");
  const [produ, setProdu] = useState(null);
  const [cantidad, setCantidad] = useState();
  const [tipo, setTipo] = useState("");
  const [modal, setModal] = useState(false);
  const classes = useStyles();

  //Guarda el movimiento en la base de datos o informa del error de ser el caso
  const guardarMovi = async (e) => {
    e.preventDefault();
    const nuevoMovi = {
      producto_id: produ.producto_id,
      cantidad: cantidad,
      tipo: tipo,
      fecha: fecha,
      observacion: observacion,
    };

    try {
      const res = await validarStock(produ.producto_id, cantidad);
      if (tipo == "entrada" || res) {
        await axios.post("/movimiento/", nuevoMovi).then((response) => {
          console.log(response)
          if (response.status === 200) {
            setRecarga(!recarga);
            seteo();
            notify("Movimiento realizado con exito", "", "info");
          } else {
            seteo();
            notify("Ha sucedido un problema intente mas tarde", "", "error");
          }
        });
      } else notify("No hay stock suficiente de:", produ.nombre_pro, "error");
    } catch (err) {
      seteo();
      notify("Ha sucedido un problema intente mas tarde, error", err, "error");
    }
  };

  /** Setea todos los campos y cierra el modal */
  const seteo = () => {
    setCantidad("");
    setProdu(null);
    setTipo("");
    setObservacion("");
    setModal(false);
  };

  //Opciones que aparecen en el filter producto
  const optionLabelProduc = (opcion) => {
    return `${opcion.codigo_pro} - ${opcion.nombre_pro}`;
  };

  //Opciones por las que se podra filtar en el filter producto
  const filtroProducto = ["nombre_pro", "codigo_pro"];

  return (
    <>
      <div>
        <MiButton
          variant="contained"
          color="primary"
          onClick={() => setModal(true)}
        >
          Movimiento
        </MiButton>
        <div id="modal" />
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={modal}
          className={classes.conte}
        >
          <DialogTitle className={classes.scrollPaper}>
            Movimiento Producto
          </DialogTitle>
          <DialogContent className={classes.scrollPaper}>
            <form
              className="formularioMovi"
              id="formularioMovi"
              onSubmit={(e) => guardarMovi(e)}
            >
              <MiFilter
                id="producto"
                label="Producto"
                tamaño={250}
                data={productos.data}
                value={produ}
                optionesFiltro={filtroProducto}
                optionLabel={optionLabelProduc}
                setValue={setProdu}
              />
              <MiInput
                id="cantidad"
                label="Cantidad"
                variant="outlined"
                size="small"
                type="number"
                value={cantidad}
                style={{ maxWidth: 250 }}
                onChange={(evento) => {
                  setCantidad(parseInt(evento.target.value));
                }}
                inputProps={{
                  min: 1,
                }}
                required
              />
              <MiInput
                id="date"
                label="Fecha"
                type="date"
                value={fecha}
                style={{ maxWidth: 250 }}
                variant="outlined"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(evento) => {
                  setFecha(evento.target.value);
                }}
              />
              <FormControl className={classes.formControl}>
                <Select
                  labelId="select-label"
                  id="select"
                  required
                  value={tipo}
                  style={{ maxWidth: 250 }}
                  onChange={(e) => setTipo(e.target.value)}
                  input={<BootstrapInput />}
                >
                  <MenuItem value="">Ninguno</MenuItem>
                  <MenuItem value="entrada">Entrada</MenuItem>
                  <MenuItem value="salida">Salida</MenuItem>
                </Select>
                <InputLabel id="select-label">Tipo Movimiento</InputLabel>
              </FormControl>
              <MiInput
                id="observacion"
                label="Observacion"
                multiline
                rows={4}
                value={observacion}
                style={{ maxWidth: 250 }}
                variant="outlined"
                size="small"
                onChange={(evento) => {
                  setObservacion(evento.target.value);
                }}
                inputProps={{
                  maxLength: 150,
                }}
              />
              <DialogActions>
                <Button variant="contained" type="submit" color="primary">
                  Terminar
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => seteo()}
                >
                  Cancelar
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Movimiento;

const MiButton = withStyles((theme) => ({
  root: {
    height: "30px",
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  conte: {
    "& .MuiDialog-paperWidthSm": {
      borderRadius: "23px",
    },
  },
  scrollPaper: {
    background: "#bbdeef",
    "& .MuiDialogActions-root": {
      justifyContent: "center",
    },
    "& .MuiTypography-root": {
      textAlign: "center",
    },
  },
  formControl: {
    "& .MuiInputLabel-formControl": {
      transform: "translate(14px, 10px) scale(1)",
      color: "black",
    },
    "& .MuiInputLabel-shrink": {
      transform: "translate(14px, -5.5px) scale(0.75)",
      backgroundColor: "rgb(72 147 210)",
      fontWeight: "bold",
    },
  },
}));

const BootstrapInput = withStyles((theme) => ({
  root: {
    "& .MuiSelect-icon": {
      marginRight: "7px",
    },
  },
  input: {
    size: "small",
    height: "21px",
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: "4px",
    border: "solid 1px #342e2e71",
    paddingLeft: "14px",
    "&:hover": {
      borderColor: "rgba(0, 0, 0, 0.87)",
    },
    "&:focus": {
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      borderColor: "#3f51b5",
      borderWidth: "2px",
      borderRadius: "4px",
      height: "19px",
    },
    color: "black",
  },
}))(InputBase);
