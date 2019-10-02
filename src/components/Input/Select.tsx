import React, { CSSProperties, HTMLAttributes } from 'react';
import clsx from 'clsx';
import Select from 'react-select';
import { createStyles, emphasize, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField, { BaseTextFieldProps } from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import PropTypes from 'prop-types';
import { ValueContainerProps } from 'react-select/lib/components/containers';
import { ControlProps } from 'react-select/lib/components/Control';
import { MenuProps, NoticeProps } from 'react-select/lib/components/Menu';
import { MultiValueProps } from 'react-select/lib/components/MultiValue';
import { OptionProps } from 'react-select/lib/components/Option';
import { PlaceholderProps } from 'react-select/lib/components/Placeholder';
import { SingleValueProps } from 'react-select/lib/components/SingleValue';
import { ValueType, ActionMeta } from 'react-select/lib/types';

interface OptionType {
  label: string;
  value: string;
}
function NoOptionsMessage(props: NoticeProps<OptionType>) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}
type InputComponentProps = Pick<BaseTextFieldProps, 'inputRef'> & HTMLAttributes<HTMLDivElement>;

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

interface IntegrationSelect {
    allowAllSelect?: boolean;
    value: OptionType[];
    isLoading?: boolean;
    isMulti?: boolean;
    isClearable?: boolean;
    isSearchable?: boolean;
    props: SelectProps;
    onChange: (value: ValueType<OptionType>, actionMeta: ActionMeta) => void;
    singleValue: ValueType<OptionType>;
}

interface SelectProps {
    label?: string;
    placeholder: string;
    inputId: string;
} 

export default function IntegrationReactSelect({allowAllSelect, value, isLoading, isMulti, isSearchable, isClearable, props, onChange, singleValue}: IntegrationSelect) {
  const classes = useStyles();
  const theme = useTheme();
  const selectStyles = {
    input: (base: CSSProperties) => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  return (
    <div className={classes.root}>
      <NoSsr>
        <Select
          classes={classes}
          styles={selectStyles}
          inputId={props.inputId}
          TextFieldProps={{
            label: props.label,
            InputLabelProps: {
              htmlFor: props.inputId,
              shrink: true,
            },
            placeholder: props.placeholder,
          }}
          noOptionsMessage={() => "Data tidak tersedia"}
          name={props.inputId}
          isLoading={isLoading}
          loadingMessage={() => "Tunggu sebentar, sedang request data ke server"}
          placeholder={!isLoading ? props.placeholder : "Tunggu sebentar, sedang request data ke server"}
          options={allowAllSelect 
            ? value 
              ? value.length !== 0 
                ? [{label: "Pilih Semua", value: "*"}, ...value] 
                : value 
              : value 
            : value}
          label={props.label}
          components={components}
          value={singleValue}
          onChange={(v: ValueType<OptionType> | readonly OptionType[], a: ActionMeta) => {
            if (Array.isArray(v) && v.length !== 0 && v[v.length - 1].value === "*") {
              return onChange(value, a)
            } else {
              return onChange(v, a)
            }
          }}
          isMulti={isMulti}
          isSearchable={isSearchable}
          isClearable={isClearable}
        />
      </NoSsr>
    </div>
  );
}

function inputComponent({ inputRef, ...props }: InputComponentProps) {
    return <div ref={inputRef} {...props} />;
  }
  function Control(props: ControlProps<OptionType>) {
    const {
      children,
      innerProps,
      innerRef,
      selectProps: { classes, TextFieldProps },
    } = props;
  
    return (
      <TextField
        fullWidth
        InputProps={{
          inputComponent,
          inputProps: {
            className: classes.input,
            ref: innerRef,
            children,
            ...innerProps,
          },
        }}
        {...TextFieldProps}
      />
    );
  }
  function Option(props: OptionProps<OptionType>) {
    return (
      <MenuItem
        ref={props.innerRef}
        selected={props.isFocused}
        component="div"
        style={{
          fontWeight: props.isSelected ? 500 : 400,
        }}
        {...props.innerProps}
      >
        {props.children}
      </MenuItem>
    );
  }
  function Placeholder(props: PlaceholderProps<OptionType>) {
    return (
      <Typography
        color="textSecondary"
        className={props.selectProps.classes.placeholder}
        {...props.innerProps}
      >
        {props.children}
      </Typography>
    );
  }
  function SingleValue(props: SingleValueProps<OptionType>) {
    return (
      <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
        {props.children}
      </Typography>
    );
  }
  function ValueContainer(props: ValueContainerProps<OptionType>) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
  }
  function MultiValue(props: MultiValueProps<OptionType>) {
    return (
      <Chip
        color="primary"
        variant="outlined"
        tabIndex={-1}
        label={props.children}
        className={clsx(props.selectProps.classes.chip, {
          [props.selectProps.classes.chipFocused]: props.isFocused,
        })}
        onDelete={props.removeProps.onClick}
        deleteIcon={<CancelIcon {...props.removeProps} />}
      />
    );
  }
  function Menu(props: MenuProps<OptionType>) {
    return (
      <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
        {props.children}
      </Paper>
    );
  }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginBottom: theme.spacing(0.5),
      marginTop: theme.spacing(0.5),
    },
    input: {
      display: 'flex',
      padding: 0,
      height: 'auto',
    },
    wa: {
      "&:selected": {
        color: "#9c27b0!important"
      },
      "&:active": {
        color: "#9c27b0!important"
      },
      "&:focus-within": {
        color: "#9c27b0!important"
      },
      "&:visited": {
        color: "#9c27b0!important"
      },
      "&:focus": {
        color: "#9c27b0!important"
      },
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      padding: theme.spacing(0.75, 0),
      alignItems: 'center',
      overflow: 'hidden',
    },
    chip: {
        height: "auto", 
      margin: theme.spacing(0.25),
      padding: theme.spacing(0.2, 0),
      borderRadius: theme.spacing(3),
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
        0.08,
      ),
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2),
    },
    singleValue: {
      fontSize: 16,
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      bottom: 6,
      fontSize: 16,
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0,
    },
    divider: {
      height: theme.spacing(2),
    },
  }),
);

inputComponent.propTypes = {
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
} as any;

Option.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    isFocused: PropTypes.bool,
    isSelected: PropTypes.bool,
} as any;

Control.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    selectProps: PropTypes.object.isRequired,
} as any;

NoOptionsMessage.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object.isRequired,
} as any;

SingleValue.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object.isRequired,
} as any;

ValueContainer.propTypes = {
    children: PropTypes.node,
    selectProps: PropTypes.object.isRequired,
} as any;

Menu.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object,
} as any;

MultiValue.propTypes = {
    children: PropTypes.node,
    isFocused: PropTypes.bool,
    removeProps: PropTypes.object.isRequired,
    selectProps: PropTypes.object.isRequired,
} as any;

Placeholder.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object.isRequired,
} as any;