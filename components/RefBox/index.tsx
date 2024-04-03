import { Button, FormControl, Stack, TextField, Typography } from '@mui/material';
import { pxToRem } from '@/theme/foundations';
import { useMetaMask } from 'providers/MetamaskProvider';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useUpdateRefByMutation } from '@/hooks';
import _ from 'lodash';

const validation = Yup.object({
  refBy: Yup.string()
    .required('Required')
    .length(9, 'Invalid ref code')
    .matches(/^[A-Z0-9]*$/, 'Invalid ref code'),
});
export const RefBox = () => {
  const { setOpenRef, setOpenDeposit, setOpenAlert, setAlertMessage } = useMetaMask();
  const { profile } = useMetaMask();
  const {
    formState: { isSubmitting },
    handleSubmit,
    control,
  } = useForm({
    defaultValues: { refBy: _.get(profile, 'userProfile.refBy', '') },
    // @ts-ignore
    resolver: yupResolver(validation),
    mode: 'onSubmit',
  });

  const updateRefCodeMutation = useUpdateRefByMutation();
  const onSubmit = async (payload: any) => {
    try {
      await updateRefCodeMutation.mutateAsync({ ...payload });
      setOpenRef(false);
      setOpenDeposit(true);
    } catch (e) {
      console.log(e);
      setAlertMessage(e.response?.data?.message ? e.response?.data?.message : e.response?.data);
      setOpenAlert(true);
    }
  };

  return (
    <Stack
      justifyContent={'center'}
      alignItems={'center'}
      position={'absolute'}
      width={1}
      height={1}
      zIndex={1001}
      bgcolor={'background.blur'}
      sx={{
        backdropFilter: 'blur(3.5px)',
      }}
    >
      <Typography color={'common.white'} fontSize={46} fontWeight={'bold'}>
        GM Zoomer!
      </Typography>
      <Typography color={'common.white'} fontSize={46} fontWeight={'bold'}>
        Welcome to Chainzoom
      </Typography>
      <Typography sx={{ mt: pxToRem(30), mb: pxToRem(20) }} variant={'body2'}>
        Input your REF code to receive exclusive perks
      </Typography>
      <Stack component={'form'} onSubmit={handleSubmit(onSubmit)}>
        <Stack
          borderRadius={pxToRem(8)}
          sx={(theme) => ({
            border: `1px solid ${theme.palette.border.dark}`,
          })}
          height={53}
          width={376}
          justifyContent={'center'}
          gap={pxToRem(12)}
        >
          <Controller
            name="refBy"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    value={field.value}
                    size={'medium'}
                    variant={'outlined'}
                    inputProps={{
                      maxLength: 9,
                    }}
                    sx={{
                      height: 1,
                      width: 1,
                      '& .MuiInputBase-input': {
                        padding: '0 16px',
                      },
                    }}
                    disabled={!!_.get(profile, 'userProfile.refBy', '')}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || ''}
                    onChange={(event) => field.onChange(event.target.value.toUpperCase().trim())}
                  />
                </FormControl>
              );
            }}
          />
        </Stack>

        <Stack width={376} height={52} mt={pxToRem(12)}>
          <Button
            type={'submit'}
            fullWidth
            disabled={isSubmitting || !!_.get(profile, 'userProfile.refBy', '')}
            variant={'soft'}
            color={'success'}
            sx={{ height: 52, fontWeight: 'bold' }}
          >
            Confirm
          </Button>
        </Stack>
      </Stack>
      <Button
        variant={'contained'}
        color={'secondary'}
        sx={{
          mt: pxToRem(56),
          width: 221,
          height: 59,
          borderRadius: pxToRem(32),
        }}
        disabled={isSubmitting}
        onClick={() => {
          setOpenRef(false);
          setOpenDeposit(true);
        }}
      >
        Skip for now!
      </Button>
    </Stack>
  );
};
