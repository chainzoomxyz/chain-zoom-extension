import { Button, FormControl, Grid, Stack, TextField, Typography } from '@mui/material';
import { pxToRem } from '@/theme/foundations';
import React from 'react';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMetaMask } from 'providers/MetamaskProvider';
import _ from 'lodash';
import { useUpdateRefByMutation } from '@/hooks';
import { ALERT_MESSAGES } from '@/utils/messages';

const validation = Yup.object({
  refBy: Yup.string()
    .required('Required')
    .length(9, 'Invalid ref code')
    .matches(/^[A-Z0-9]*$/, 'Invalid ref code'),
});

export const InputRefBy = () => {
  const { profile, setOpenAlert, setAlertMessage } = useMetaMask();
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
      setAlertMessage(ALERT_MESSAGES.UPDATE_REF_BY_SUCCESS);
      setOpenAlert(true);
    } catch (e) {
      console.log(e);
      setAlertMessage(e.response?.data?.message ? e.response?.data?.message : e.response?.data);
      setOpenAlert(true);
    }
  };
  return (
    <Stack gap={1} mt={pxToRem(18)} component={'form'} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant={'body1'} color={'common.white'}>
        Input referral code
      </Typography>
      <Grid container height={53}>
        <Grid
          item
          xs={8}
          sx={(theme) => ({ border: `1px solid ${theme.palette.border.dark}` })}
          borderRadius={'6px 0 0 6px'}
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
                        fontSize: 24,
                      },
                    }}
                    helperText={fieldState?.error?.message ?? ''}
                    onChange={(event) => field.onChange(event.target.value.toUpperCase().trim())}
                  />
                </FormControl>
              );
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            type={'submit'}
            fullWidth
            variant={'soft'}
            color={'success'}
            size={'large'}
            sx={{ fontWeight: 'bold', height: 1, borderRadius: '0 6px 6px 0' }}
            disabled={isSubmitting || !!_.get(profile, 'userProfile.refBy', '')}
          >
            Confirm
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
};
