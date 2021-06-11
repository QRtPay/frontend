import React, { useState, useCallback, useRef, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  withStyles,
  Box,
  isWidthUp,
  withWidth
} from "@material-ui/core";
import classNames from "classnames";
import smoothScrollTop from "../../../shared/functions/smoothScrollTop";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import VisibilityPasswordTextField from "../../../shared/components/VisibilityPasswordTextField";

const styles = (theme) => ({
  dataBox: {
    margin: '0 auto'
  }
});

function RegisterConfirm(props) {
  const { classes, history, width } = props;
  const [isLoading, setIsLoading] = useState(false);
  const registerPassword = useRef();
  const registerPasswordRepeat = useRef();
  const confirmCode = useRef();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [ErrorText, setErrorText] = useState("");
  const [status, setStatus] = useState(null);
  
  useEffect(() => {
    document.title = "WaVer - Регистрация";
    let code = new URLSearchParams(props.location.search).get("code")
    if (code != undefined) {
      confirmCode.current.value = code;
    };
    smoothScrollTop();
  });

  const confirm = useCallback(() => {
    if (registerPassword.current.value !== registerPasswordRepeat.current.value) {
      setStatus("passwordsDontMatch");
      return;
    }

    // if (registerPasswordRepeat.current.value.length < 6) {
    //   setStatus("passwordTooShort");
    //   return;
    // }

    setStatus(null);
    setIsLoading(true);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pass: registerPassword.current.value })
    };

    fetch('https://wizaxxx.ru/back_api/v1/confirm_registration/' + confirmCode.current.value, requestOptions)
      .then(async response => {
        const data = await response.json();

        setTimeout(() => {
          setIsLoading(false);

          // check for error response
          if (!response.ok) {
            setStatus("error");
            setErrorText(data.error.desc);
            return;
          }
          
          localStorage.setItem('auth_token', data.result.token);
          setStatus("accountCreated");
          history.push("/c/dashboard");

        }, 1500);
      })
      .catch(error => {
        setStatus("error");
        setErrorText("Не удалось выполнить запрос");
      });
  }, [
    setIsLoading,
    setStatus,
    registerPassword,
    confirmCode,
    history
  ]);

  return (
    <Box
      className={classNames("lg-p-top", classes.dataBox)}
      width={ isWidthUp("md", width) ? '30%' : '60%' }
    >
      <TextField
            variant="outlined"
            required
            fullWidth
            label="Код подтверждения"
            inputRef={confirmCode}
            autoFocus
            autoComplete="off"
            type="text"
            onChange={() => {
              if (status === "invalidEmail") {
                setStatus(null);
              }
            }}
            FormHelperTextProps={{ error: true }}
            disabled={isLoading}
          />
      <VisibilityPasswordTextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={
              status === "passwordTooShort" || status === "passwordsDontMatch"
            }
            label="Пароль"
            inputRef={registerPassword}
            onChange={() => {
              if (
                status === "passwordTooShort" ||
                status === "passwordsDontMatch"
              ) {
                setStatus(null);
              }
            }}
            helperText={(() => {
              if (status === "passwordTooShort") {
                return "Пароль должен содержать минимум 6 символов.";
              }
              if (status === "passwordsDontMatch") {
                return "Указанные пароли не совпадают.";
              }
              return null;
            })()}
            FormHelperTextProps={{ error: true }}
            isVisible={isPasswordVisible}
            onVisibilityChange={setIsPasswordVisible}
            disabled={isLoading}
          />
      <VisibilityPasswordTextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={
              status === "passwordTooShort" || status === "passwordsDontMatch"
            }
            label="Пароль еще раз"
            inputRef={registerPasswordRepeat}
            autoComplete="off"
            onChange={() => {
              if (
                status === "passwordTooShort" ||
                status === "passwordsDontMatch"
              ) {
                setStatus(null);
              }
            }}
            helperText={(() => {
              if (status === "passwordTooShort") {
                return "Пароль должен содержать минимум 6 символов.";
              }
              if (status === "passwordsDontMatch") {
                return "Указанные пароли не совпадают.";
              }
            })()}
            FormHelperTextProps={{ error: true }}
            isVisible={isPasswordVisible}
            onVisibilityChange={setIsPasswordVisible}
            disabled={isLoading}
          />

          {status === "error" && (
            <HighlightedInformation>
              {ErrorText}
            </HighlightedInformation>
          )}

      <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          color="secondary"
          disabled={isLoading}
          onClick= {() => {confirm()}}
        >
          Подтвердить регистрацию
          {isLoading && <ButtonCircularProgress />}
        </Button>
    </Box>
  );
}

RegisterConfirm.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(RegisterConfirm));
