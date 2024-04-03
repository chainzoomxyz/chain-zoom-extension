import { Box, FormControl, Stack, TextField, Typography } from '@mui/material';
import { pxToRem } from '@/theme/foundations';
import { images } from '@/utils/images';
import React, { type SetStateAction, useState } from 'react';
import { useMetaMask } from 'providers/MetamaskProvider';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpdateRefCodeMutation } from '@/hooks';
import _ from 'lodash';
import { copyToClipboard } from '@/utils/helper';
import { ALERT_MESSAGES } from '@/utils/messages';

const validation = Yup.object({
  refCode: Yup.string()
    .required('Required')
    .length(9, 'Invalid ref code')
    .matches(/^[A-Z0-9]*$/, 'Invalid ref code'),
});

export const RefCodeForm = (props: { refCode: string }) => {
  const { profile, setAlertMessage, setOpenAlert } = useMetaMask();
  const [isEdit, setIsEdit] = useState(false);
  const {
    formState: { isSubmitting, errors },
    handleSubmit,
    control,
  } = useForm({
    defaultValues: { refCode: props.refCode },
    // @ts-ignore
    resolver: yupResolver(validation),
    mode: 'all',
  });

  const updateRefCodeMutation = useUpdateRefCodeMutation();

  const onSubmit = async (payload: any) => {
    try {
      await updateRefCodeMutation.mutateAsync(payload);
      setAlertMessage(ALERT_MESSAGES.UPDATE_REF_CODE_SUCCESS);
      setOpenAlert(true);
      setIsEdit(false);
    } catch (e) {
      console.log(e);
      setAlertMessage(e.response?.data?.message ? e.response?.data?.message : e.response?.data);
      setOpenAlert(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="refCode"
        control={control}
        render={({ field }) => {
          return (
            <FormControl fullWidth>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography color={'text.secondary'} variant={'body2'}>
                  Ref code
                </Typography>
                <Typography color={'text.secondary'} variant={'body2'}>
                  {field.value.length}/9
                </Typography>
              </Stack>
              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                height={29}
                borderRadius={pxToRem(8)}
                width={1}
                bgcolor={'common.white'}
                overflow={'hidden'}
              >
                <TextField
                  {...field}
                  value={field.value}
                  fullWidth
                  disabled={
                    (isSubmitting && _.get(profile, 'userProfile.isRefCodeUpdatedByUser', false)) ||
                    !isEdit
                  }
                  sx={{
                    height: 1,
                    '& .MuiInputBase-input': {
                      padding: '0 8px',
                      fontSize: 12,
                    },
                    '& .MuiInputBase-root': {
                      backgroundColor: '#fff',
                    },
                  }}
                  inputProps={{
                    maxLength: 9,
                  }}
                  InputProps={{
                    disabled: false,
                    disableUnderline: true,
                    endAdornment: (
                      <EndAdornmentIcon
                        isRefCodeUpdatedByUser={_.get(
                          profile,
                          'userProfile.isRefCodeUpdatedByUser',
                          false,
                        )}
                        isEdit={isEdit}
                        errors={errors}
                        setIsEdit={setIsEdit}
                        refCode={field.value}
                      />
                    ),
                  }}
                  type={'text'}
                  onChange={(event) => field.onChange(event.target.value.toUpperCase().trim())}
                  variant={'filled'}
                />
              </Stack>
              <Stack direction={'row'} mt={pxToRem(4)} alignItems={'center'}>
                <Box width={13} height={13}>
                  <img src={images.iconWarningDark} alt="" />
                </Box>
                <Typography color={'text.secondary'} fontSize={11}>
                  You can only input this once.
                </Typography>
              </Stack>
            </FormControl>
          );
        }}
      />
    </form>
  );
};

const EndAdornmentIcon = (props: {
  isRefCodeUpdatedByUser: boolean;
  isEdit: boolean;
  errors: any;
  setIsEdit: React.Dispatch<SetStateAction<boolean>>;
  refCode: string;
}) => {
  const { setAlertMessage, setOpenAlert } = useMetaMask();
  return (
    <Stack
      direction={'row'}
      width={16}
      mr={!props.isRefCodeUpdatedByUser && !props.isEdit ? pxToRem(8) : 0}
      height={16}
      gap={pxToRem(4)}
      sx={{ cursor: 'pointer' }}
    >
      {!props.isRefCodeUpdatedByUser && !props.isEdit && (
        <img onClick={() => props.setIsEdit(true)} src={images.iconEditDark} alt="" />
      )}

      {!props.isRefCodeUpdatedByUser && props.isEdit && (
        <img src={props.errors?.refCode ? images.iconFailed : images.iconSuccess} alt="" />
      )}
      {!props.isEdit && (
        <img
          src={images.iconCopyDark}
          alt=""
          onClick={() => {
            setAlertMessage(ALERT_MESSAGES.COPY_REF_CODE_SUCCESS);
            setOpenAlert(true);
            copyToClipboard(props.refCode);
          }}
        />
      )}
    </Stack>
  );
};
