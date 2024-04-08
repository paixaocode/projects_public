#Include "Protheus.ch"
#Include "FwMVCDef.ch"

/*/{Protheus.doc} MATA131
Ponto de entrada para realizar as validações na analise de cotação.
@Type Function
@Author Gabriel Paixão
@Since 29/03/2024
/*/
User Function MT161TOK()

	Local lRet 	  	:= .F.
	Local aItens  	:= ParamIXB[1]
	Local cTpDoc  	:= ParamIXB[4]

	If cTpDoc == 'Pedido de Compra'

		If SC8->C8_XSTSPL == 3
			FwAlertError("A cotação não pode ser finalizada, pois o fornecedor declarou falta de estoque.", "Falta de estoque!")
		EndIf
		/*
			Verifica se o fornecedor possui gravação na ZLX
			isso significa que o fornecedor tem um orçamento pedente
			caso o orçamento vencedor seja o dele, encerra como ganho,
			se não atualiza o status para notifica-lo que ele não foi o 
			fornecedor escolhido.
		*/
		lRet := EvaluateBg(aItens)
	EndIf

Return lRet


/*/{Protheus.doc} EvaluateBg
Avalia se o orçamento vencedor pertence a um fornecedor
que utiliza o Supplier Portal, caso pertenca a um fornecedor
realiza a notificação que o orçamento foi aprovado
@Type Function
@Author Gabriel Paixão
@Since 06/04/2024
/*/
Static Function EvaluateBg(aItens)

	Local lRet 		:= .F.
	Local xNext		:= .F.
	Local nX,nI,nJ 	:= 0
	Local cCodFor 	:= ''
	Local aResponse := {}
	Local cReq 		:= ''

	Default aItens  := {}

	For nX := 1 to Len(aItens)
		cCodFor := aItens[nX,10]
		If u_UsrSupplier(cCodFor)
			aResponse := u_ExistZLX(cCodFor)
			If Len(aResponse) > 0
				For nI := 1 to Len(aResponse)
					If aResponse[nI,1] == SC8->C8_NUM
						xNext := .T.
						If xNext
							ZLX->(DbSelectArea('ZLX'))
							ZLX->(DbSetOrder(2))
							If ZLX->(DbSeek(aResponse[nI,1]))
								xNext := U_UpdStatSpl(SC8->C8_NUM, SC8->C8_FORNECE, SC8->C8_ITEM, 4, ReadValue('SA2',1, xFilial('SA2') + SC8->C8_FORNECE, 'A2_LOJA'))
								If xNext
									aAux := StrTokArr(ZLX->ZLX_ACAO, ';')
									If Len(aAux) == 1
										aAux := StrTokArr(ZLX->ZLX_ACAO, '.')
										If U_GetStProd(SC8->C8_XSTSPL) != aAux[8]
											cReq := StrTran(ZLX->ZLX_ACAO, aAux[8], U_GetStProd(SC8->C8_XSTSPL))
											If !Empty(cReq)
												If RecLock('ZLX', .F.)
													ZLX->ZLX_ACAO := cReq
													ZLX->(MsUnlock())
													lRet := .T.
												EndIf
											EndIf
										EndIf
									Else
										For nJ := 1 to Len(aAux)
											aAux[nJ] := StrTokArr(aAux[nJ], '.')
											If U_GetStProd(SC8->C8_XSTSPL) != aAux[nJ,8]
												cReq += StrTran(ZLX->ZLX_ACAO, aAux[nJ,8], U_GetStProd(SC8->C8_XSTSPL))
											EndIf
										Next
										If !Empty(cReq)
											If RecLock('ZLX', .F.)
												ZLX->ZLX_ACAO := cReq
												ZLX->(MsUnlock())
												lRet := .T.
											EndIf
										EndIf
									EndIf
								EndIf
							EndIf
						EndIf
					EndIf
				Next
			EndIf
		EndIf
	Next

Return lRet
