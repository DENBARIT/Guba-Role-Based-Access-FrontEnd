import React from 'react'
import { ToastContext } from '../context/toast-context.js'
export function useToast(){ return React.useContext(ToastContext) }
