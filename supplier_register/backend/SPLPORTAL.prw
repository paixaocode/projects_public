#Include "Protheus.ch"
#Include "RESTFul.ch"
#Include "TopConn.ch"

/* {Protheus.doc} WS supplierPortal
APIs do supplier portal
@author Gabriel Paixão
@since 27/02/2024
*/
WSRESTFUL supplierPortal DESCRIPTION "Integrações Supplier Portal"

	WSDATA tokenInicial as STRING

	WSMETHOD POST NEW;
		DESCRIPTION 'Inclui um novo supplier';
		WSSYNTAX '/api/service/supplier/v1/register';
		PATH '/api/service/supplier/v1/register';
		TTALK 'v1';
		PRODUCES APPLICATION_JSON

	WSMETHOD POST SET;
		DESCRIPTION 'Realiza a autenticação do supplier';
		WSSYNTAX '/api/service/supplier/v1/auth';
		PATH '/api/service/supplier/v1/auth';
		TTALK 'v1';
		PRODUCES APPLICATION_JSON

	WSMETHOD POST EMAIL;
		DESCRIPTION 'Envia um e-mail para resetar a senha';
		WSSYNTAX '/api/service/supplier/v1/send/email/recovery-password';
		PATH '/api/service/supplier/v1/send/email/recovery-password';
		TTALK 'v1';
		PRODUCES APPLICATION_JSON

	WSMETHOD GET NEW;
		DESCRIPTION 'Retorna se o Token é valido ou não';
		WSSYNTAX '/api/service/supplier/v1/token';
		PATH '/api/service/supplier/v1/token';
		TTALK 'v1';
		PRODUCES APPLICATION_JSON

	WSMETHOD POST INFOORCAMENTO;
		DESCRIPTION 'Consulta as informações do orçamento';
		WSSYNTAX '/api/service/supplier/v1/budget/query';
		PATH '/api/service/supplier/v1/budget/query';
		TTALK 'v1';
		PRODUCES APPLICATION_JSON

	WSMETHOD POST BUDGETOFF;
		DESCRIPTION 'Atualiza os preços do orçamento';
		WSSYNTAX '/api/service/supplier/v1/budget/update/budget-off';
		PATH '/api/service/supplier/v1/budget/update/budget-off';
		TTALK 'v1';
		PRODUCES APPLICATION_JSON

	WSMETHOD POST METRICS;
		DESCRIPTION 'Atualiza os preços do orçamento';
		WSSYNTAX '/api/service/supplier/v1/budget/query/metrics';
		PATH '/api/service/supplier/v1/budget/query/metrics';
		TTALK 'v1';
		PRODUCES APPLICATION_JSON

	WSMETHOD PUT NEW;
		DESCRIPTION 'Atualiza os preços do orçamento';
		WSSYNTAX '/api/service/supplier/v1/budget/update';
		PATH '/api/service/supplier/v1/budget/update';
		TTALK 'v1';
		PRODUCES APPLICATION_JSON

END WSRESTFUL


/*/{Protheus.doc} supplierPortal
Retorna o produto mais vendido, e o menos vendido.
A api retorna um array com dois tipos:
[1] = Mais vendido
[2] = Menos vendido
@author Gabriel Paixão
@since 26/03/2024
@version 1.0
@type wsrestful
/*/
WSMETHOD POST METRICS WSSERVICE supplierPortal

	Local lRet       := .T.
	Local jJson      := Nil
	Local cJson      := Self:GetContent()
	Local jResponse  := JsonObject():New()
	Local cFor 		 := ""
	Local aRet   	 := {}
	Local cQry   	 := ''
	Local aPar	 	 := {}
	Local cAlias 	 := ''

	Self:SetContentType('application/json')
	jJson  := JsonObject():New()
	cError := jJson:FromJson(cJson)

	If !Empty(cError)
		Self:setStatus(500)
		jResponse['errorId']  := '001'
		jResponse['error']    := 'Ocorreu um erro ao realizar o parse'
		jResponse['solution'] := EncodeUTF8('Verifique as informações do body')
		Self:setStatus(500)
		Self:SetResponse(jResponse:toJSON())
		Return
	EndIf

	cFor := ReadValue('SA2',11, WebEncript(jJson:GetJsonObject('token'), .F.), 'A2_COD')

	If Empty(cFor)
		Self:setStatus(500)
		jResponse['errorId']  := '002'
		jResponse['error']    := EncodeUTF8('Não foi possível encontrar o fornecedor na base de dados.')
		jResponse['solution'] := EncodeUTF8('Verifique as infomações, ou entre em contato com o administrador.')
		Self:setStatus(500)
		Self:SetResponse(jResponse:toJSON())
		Return
	EndIf

	cQry += " SELECT"
	cQry += " '1' AS TIPO,"
	cQry += " SC8.C8_PRODUTO as PRODUTO,"
	cQry += " SUM(SC8.C8_QUANT) AS QUANTVENDIDA,"
	cQry += " SB1.B1_DESC AS DESCRICAO"
	cQry += " FROM "+RetSqlName("SC8") + " AS SC8"
	cQry += " JOIN"
	cQry += " "+RetSqlName("SB1")+ " AS SB1 ON SC8.C8_PRODUTO = SB1.B1_COD"

	cQry += " WHERE"
	cQry += " SC8.C8_NUMPED <> ' '"
	cQry += " AND SC8.D_E_L_E_T_ = ' '"
	cQry += " AND SC8.C8_QUANT > ? "
	cQry += " AND SC8.C8_FORNECE = ?"
	cQry += " AND SC8.C8_PRODUTO IN("
	cQry += " SELECT TOP 1 SC8_SUB.C8_PRODUTO"
	cQry += " FROM "+RetSqlName("SC8") + " AS SC8_SUB"
	cQry += " WHERE SC8_SUB.C8_NUMPED <> ' '"
	cQry += " AND SC8_SUB.D_E_L_E_T_ = ' '"
	cQry += " AND SC8_SUB.C8_QUANT > ?"
	cQry += " AND SC8_SUB.C8_FORNECE = ?"
	cQry += " GROUP BY SC8_SUB.C8_PRODUTO"
	cQry += " ORDER BY SUM(SC8_SUB.C8_QUANT) DESC"
	cQry += " )"

	cQry += " GROUP BY"
	cQry += " SC8.C8_PRODUTO,"
	cQry += " SB1.B1_DESC"

	cQry += " UNION ALL"

	cQry += " SELECT"
	cQry += " '2' AS TIPO,"
	cQry += " SC8.C8_PRODUTO AS PRODUTO,"
	cQry += " SUM(SC8.C8_QUANT) AS QUANTVENDIDA,"
	cQry += " SB1.B1_DESC AS DESCRICAO"
	cQry += " FROM "+RetSqlName("SC8") +  " AS SC8"
	cQry += " JOIN"
	cQry += " "+RetSqlName("SB1")+ " AS SB1 ON SC8.C8_PRODUTO = SB1.B1_COD"
	cQry += " WHERE"
	cQry += " SC8.C8_NUMPED <> ' '"
	cQry += " AND SC8.D_E_L_E_T_ = ' '"
	cQry += " AND SC8.C8_QUANT > ?"
	cQry += " AND SC8.C8_FORNECE = ?"
	cQry += " AND SC8.C8_PRODUTO IN ("
	cQry += " SELECT TOP 1 SC8_SUB.C8_PRODUTO"
	cQry += " FROM "+RetSqlName("SC8") + " AS SC8_SUB"
	cQry += " WHERE SC8_SUB.C8_NUMPED <> ' '"
	cQry += " AND SC8_SUB.D_E_L_E_T_ = ' '"
	cQry += " AND SC8_SUB.C8_QUANT > ?"
	cQry += " AND SC8_SUB.C8_FORNECE = ?"
	cQry += " GROUP BY SC8_SUB.C8_PRODUTO"
	cQry += " ORDER BY SUM(SC8_SUB.C8_QUANT) ASC"
	cQry += " )"
	cQry += " GROUP BY"
	cQry += " SC8.C8_PRODUTO,"
	cQry += " SB1.B1_DESC"
	cQry += " ORDER BY TIPO"

	aPar 	:= {'0', cFor, '0', cFor, '0', cFor, '0', cFor}

	cAlias 	:= MPSysOpenQuery(cQry,,,,aPar)

	(cAlias)->(DbGoTop())
	While (cAlias)->(!EoF())
		aAdd(aRet, {(cAlias)->TIPO, AllTrim((cAlias)->DESCRICAO), (cAlias)->QUANTVENDIDA})
		(cAlias)->(DbSkip())
	EndDo

	If Len(aRet) > 0
		aRet := PrdVenQry(aRet)
		If Len(aRet) > 0
			jResponse['message'] := aRet
		Else
			Self:setStatus(500)
			jResponse['errorId']  := '003'
			jResponse['error']    := 'Houve um erro ao consultar os dados do fornecedor: ' + cFor
			jResponse['solution'] := EncodeUTF8('Para mais informações entre em contato com um administrador.')
			Self:setStatus(500)
			Self:SetResponse(jResponse:toJSON())
			Return
		EndIf
	Else
		jResponse['message'] := EncodeUTF8('Não existe produtos mais, ou menos vendido para esse fornecedor')
	EndIf

	Self:SetResponse(jResponse:toJSON())

Return lRet

/*/{Protheus.doc} supplierPortal
Realiza a comunicação da falta de estoque
@author Gabriel Paixão
@since 26/03/2024
@version 1.0
@type wsrestful
/*/
WSMETHOD POST BUDGETOFF WSSERVICE supplierPortal

	Local lRet       := .T.
	Local jJson      := Nil
	Local cJson      := Self:GetContent()
	Local jResponse  := JsonObject():New()
	Local cFor 		 := ""
	Local cLoja		 := ""

	Self:SetContentType('application/json')
	jJson  := JsonObject():New()
	cError := jJson:FromJson(cJson)

	If !Empty(cError)
		Self:setStatus(500)
		jResponse['errorId']  := '001'
		jResponse['error']    := 'Ocorreu um erro ao realizar o parse'
		jResponse['solution'] := EncodeUTF8('Verifique as informações do body')
		Self:setStatus(500)
		Self:SetResponse(jResponse:toJSON())
		Return
	EndIf

	cFor     := ReadValue('SA2',11, WebEncript(jJson:GetJsonObject('token'), .F.), 'A2_COD')
	cLoja    := ReadValue('SA2',11, WebEncript(jJson:GetJsonObject('token'), .F.), 'A2_LOJA')
	cNumOrc  := jJson:GetJsonObject('numOrcamento')
	cNumItem := jJson:GetJsonObject('numeroItem')

	lRet := u_UpdStatSpl(cNumOrc, cFor , cNumItem, 3, cLoja)

	If lRet
		jResponse['message'] := 'Falta de estoque comunicada'
	Else
		Self:setStatus(500)
		jResponse['errorId']  := '002'
		jResponse['error']    := 'Ocorreu um erro ao comunicar a falta de estoque'
		jResponse['solution'] := EncodeUTF8('Não foi possível atualizar o status do orcamento para 3')
	EndIf


	Self:SetResponse(jResponse:toJSON())

Return lRet

/*/{Protheus.doc} supplierPortal
API que realiza a consulta do orçamento atrelado ao fornecedor, e devolve os dados
de acordo com a solicitação da empresa
{
	Status da ZLX:
	
	[1] - Orçamento finalizado
	[2] - Orçamento em aberto
	[3] - Orçamento escolhido
}
@author Gabriel Paixão
@since 21/03/2024
@version 1.0
@type wsrestful
/*/
WSMETHOD POST INFOORCAMENTO WSSERVICE supplierPortal

	Local lRet       := .T.
	Local jJson      := Nil
	Local cJson      := Self:GetContent()
	Local jResponse  := JsonObject():New()
	Local oException := ErrorBlock({|e| cErroBlk := + e:Description + e:ErrorStack, lRet := .F. })
	Local cQry 		 := ''
	Local cAlias 	 := ''
	Local aPar  	 := {}
	Local lData		 := .F.
	Local aData 	 := {}
	Local nX,nY      := 0
	Local cFor  	 := ''
	Local cLoja  	 := ''
	Local cReq       := ''

	Self:SetContentType('application/json')
	jJson  := JsonObject():New()
	cError := jJson:FromJson(cJson)

	If !Empty(cError)
		Self:setStatus(500)
		jResponse['errorId']  := '001'
		jResponse['error']    := 'Ocorreu um erro ao realizar o parse'
		jResponse['solution'] := 'Verifique se o token foi enviado corretamente'
		Self:setStatus(500)
		Self:SetResponse(jResponse:toJSON())
		Return
	EndIf

	SC8->(DbSelectArea('SC8'))
	SC8->(DbSetOrder(1))
	SA2->(DbSelectArea('SA2'))
	SA2->(DbSetOrder(11))

	SA2->(DbSeek(WebEncript(jJson:GetJsonObject('token'), .F.)))

	cFor  := SA2->A2_COD
	cLoja := SA2->A2_LOJA

	//Verifica se existe algum orçamento para o fornecedor
	cQry += " SELECT ZLX_ORCAME, ZLX_TOKEN, ISNULL(CAST(CAST(ZLX_ACAO AS VARBINARY(8000)) AS VARCHAR(8000)),'') AS ZLX_ACAO, R_E_C_N_O_ AS RECNO FROM "+RetSqlName("ZLX") + " WHERE ZLX_STATUS =? AND ZLX_TOKEN =? AND D_E_L_E_T_ <> ?"

	aPar 	:= {'2', jJson:GetJsonObject('token'), "*"}

	cAlias 	:= MPSysOpenQuery(cQry,,,,aPar)

	(cAlias)->(DbGoTop())
	While (cAlias)->(!EoF())
		aAdd(aData, {(cAlias)->ZLX_ORCAME, (cAlias)->ZLX_TOKEN, (cAlias)->ZLX_ACAO, (cAlias)->RECNO})
		(cAlias)->(DbSkip())
	EndDo

	//Verifica se o status do produto no orçamento permanece o mesmo
	For nX := 1 to Len(aData)
		aAux := StrTokArr(aData[nX,3], ';')
		For nY := 1 to Len(aAux)
			aStatus := StrTokArr(aAux[nY], '.')
			If SC8->(DbSeek(xFilial("SC8") + aData[nX,1] + cFor + cLoja + aStatus[6]))
				If U_GetStProd(SC8->C8_XSTSPL) != AllTrim(aStatus[8])
					If nY == Len(aAux)
						cReq += StrTran(aAux[nY], AllTrim(aStatus[8]), U_GetStProd(SC8->C8_XSTSPL))
					Else
						cReq += StrTran(aAux[nY], AllTrim(aStatus[8]), U_GetStProd(SC8->C8_XSTSPL)) + ';'
					EndIf
				EndIf
			EndIf
		Next
		If !Empty(cReq)
			ZLX->(DbSelectArea('ZLX'))
			ZLX->(DbGoTo(aData[nX,4]))
			If RecLock('ZLX', .F.)
				ZLX->ZLX_ACAO := AllTrim(cReq)
				ZLX->(MsUnlock())
			EndIf
			aData[nX,3] := cReq
			cReq := ''
		EndIf
	Next

	lData := Len(aData) > 0

	If !lData
		jResponse['data'] := 'false'
	EndIf

	If lData
		aData := GetJsonBudget(aData)
		If Len(aData) > 0
			jResponse['data'] := aData
		Else
			jResponse['data'] := 'false'
		EndIf
	EndIf

	(cAlias)->(DbCloseArea())
	SC8->(DbCloseArea())
	SA2->(DbCloseArea())
	ZLX->(DbCloseArea())


	Self:SetResponse(jResponse:toJSON())

Return lRet


/*/{Protheus.doc} supplierPortal
API para realizar a atualização do orçamento.
@author Gabriel Paixão
@since 21/03/2024
@version 1.0
@type wsrestful
/*/
WSMETHOD PUT NEW WSRECEIVE WSSERVICE supplierPortal

	Local lRet       := .T.
	Local jJson      := Nil
	Local cJson      := Self:GetContent()
	Local jResponse  := JsonObject():New()
	Local oJsonName	 := JsonObject():New()
	Local oException := ErrorBlock({|e| cErroBlk := + e:Description + e:ErrorStack, lRet := .F. })
	Local xField	 := Nil
	Local cToken	 := ''
	Local cNumOrc	 := ''
	Local cCodProd	 := ''
	Local cProdDesc	 := ''
	Local cVlrProp	 := ''
	Local cPrzEntre	 := ''
	Local cNumItem   := ''
	Local cNumProd   := ''
	Local cQuantProd := ''
	Local nX		 := 0

	Self:SetContentType('application/json')
	jJson  := JsonObject():New()
	cError := jJson:FromJson(cJson)


	If Empty(cErro)
		oJsonName:fromJson(cJson)
		xField := oJsonName:GetNames()

		//Verifica o preenchimento dos campos obrigatórios
		For nX := 1 to Len(xField)
			If Empty(jJson:GetJsonObject(xField[nX]))
				Self:setStatus(500)
				jResponse['errorId']  := 'emptyField'
				jResponse['error']    := EncodeUTF8('O campo: ' + xField[nX] + ' não está preenchido!')
				jResponse['solution'] := 'Preencha o campo e tente novamente'
				Self:setStatus(500)
				Self:SetResponse(jResponse:toJSON())
				Return
			EndIf
		Next

		cToken 		:= jJson:GetJsonObject('token')
		cNumOrc  	:= jJson:GetJsonObject('numOrcamento')
		cCodProd	:= jJson:GetJsonObject('codigoProduto')
		cProdDesc	:= jJson:GetJsonObject('produtoDescricao')
		cVlrProp	:= jJson:GetJsonObject('valor_proposto')
		cPrzEntre	:= jJson:GetJsonObject('prazo_entrega')
		cNumItem	:= jJson:GetJsonObject('numeroItem')
		cNumProd	:= jJson:GetJsonObject('numeroProduto')
		cQuantProd  := jJson:GetJsonObject('quantidadeProduto')

		lRet := SetBudget(cToken, cNumOrc, cCodProd, cProdDesc, cVlrProp, cPrzEntre, cNumItem, cNumProd, cQuantProd)

		If lRet
			jResponse['message']  := 'Budget updated successfully'
		Else
			Self:setStatus(500)
			jResponse['errorId']  := '001'
			jResponse['error']    := 'Houve um erro ao realizar a atualização do orçamento.'
			jResponse['solution'] := EncodeUTF8('Verifique as inoformações enviadas, e tente novamente.')
			Self:setStatus(500)
			Self:SetResponse(jResponse:toJSON())
			Return
		EndIf
	Else
		Self:setStatus(500)
		jResponse['errorId']  := '002'
		jResponse['error']    := 'Houve um erro ao realizar a atualização do orçamento.'
		jResponse['solution'] := EncodeUTF8('Verifique o corpo da requisição, caso o erro persita, entre em contato com o administrador do sistema.')
		Self:setStatus(500)
		Self:SetResponse(jResponse:toJSON())
		Return
	EndIf

	Self:SetResponse(jResponse:toJSON())

Return lRet


/*/{Protheus.doc} supplierPortal
Realiza o envio de e-email para o fornecedor resetar a senha.
É enviado um link para resetar a senha.
@author Gabriel Paixão
@since 03/03/2024
@version 1.0
@type wsrestful
/*/
WSMETHOD POST EMAIL WSRECEIVE WSSERVICE supplierPortal

	Local lRet       := .T.
	Local jJson      := Nil
	Local cJson      := Self:GetContent()
	Local jResponse  := JsonObject():New()
	Local oException := ErrorBlock({|e| cErroBlk := + e:Description + e:ErrorStack, lRet := .F. })


	Self:SetContentType('application/json')
	jJson  := JsonObject():New()
	cError := jJson:FromJson(cJson)

	jResponse['message'] := EncodeUTF8('Ainda não é possível realizar o reset de senha por aqui. Realize pelo servidor!')

	Self:SetResponse(jResponse:toJSON())

Return lRet


/*/{Protheus.doc} supplierPortal
Realiza a autenticação do fornecedor
@author Gabriel Paixão
@since 03/03/2024
@version 1.0
@type wsrestful
/*/
WSMETHOD POST SET WSRECEIVE WSSERVICE supplierPortal

	Local lRet       := .T.
	Local jJson      := Nil
	Local cJson      := Self:GetContent()
	Local jResponse  := JsonObject():New()
	Local cAlias 	 := "SA2"
	Local cPass		 := ""

	Self:SetContentType('application/json')
	jJson  := JsonObject():New()
	cError := jJson:FromJson(cJson)

	If !Empty(cError)
		Self:setStatus(500)
		jResponse['errorId']  := '001'
		jResponse['error']    := cError
		jResponse['solution'] := 'Erro ao realizar o parse do JSON, entre em contato com o administrador do servidor.'
		Self:setStatus(500)
		Self:SetResponse(jResponse:toJSON())
		Return
	EndIf

	DbSelectArea(cAlias)
	DbSetOrder(3) //CNPJ

	If MsSeek(FWxFilial("SA2") + jJson:GetJsonObject('cnpj'))
		cPass := SA2->A2_PASSUP
		If !Empty(cPass)
			cPass := GetPassWord(cPass, .T.)

			If !Empty(cPass)
				lRet := cPass == jJson:GetJsonObject('password')
			Else
				lRet := .F.
			EndIf

			If lRet
				jResponse['cod'] := SA2->A2_COD
				jResponse['nomeFantasia'] := AllTrim(SA2->A2_NREDUZ)
				jResponse['token'] := WebEncript(SA2->A2_TOKEN, .T.)
			EndIf
		Else
			lRet := .F.
		EndIf
	Else
		lRet := .F.
	EndIf

	If !lRet
		Self:setStatus(500)
		jResponse['errorId'] := '002'
		jResponse ['error']  := EncodeUTF8('Erro ao validar as informações')
		jResponse ['solution']  := EncodeUTF8('Por favor, revise as informações e tente novamente')
	EndIF

	Self:SetResponse(jResponse:toJSON())

Return lRet

/*/{Protheus.doc} supplierPortal
Inclusão do fornecedor
@author Gabriel Paixão
@since 03/03/2024
@version 1.0
@type wsrestful
/*/
WSMETHOD POST NEW WSRECEIVE WSSERVICE supplierPortal

	Local lRet        := .T.
	Local jJson       := Nil
	Local cJson       := Self:GetContent()
	Local jResponse   := JsonObject():New()
	Local oModel	  := FWLoadModel("MATA020M")
	Local oMdlSA2	  := Nil
	Local oException  := ErrorBlock({|e| cErroBlk := + e:Description + e:ErrorStack, lRet := .F. })
	Local cError	  := ""
	Local aErro		  := ""
	Local xResponse   := Nil

	Self:SetContentType('application/json')
	jJson  := JsonObject():New()
	cError := jJson:FromJson(cJson)

	If !Empty(cError)
		Self:setStatus(500)
		jResponse['errorId']  := '001'
		jResponse['error']    := cError
		jResponse['solution'] := 'Erro ao realizar o parse do JSON, entre em contato com o administrador do servidor.'
		Self:setStatus(500)
		Self:SetResponse(jResponse:toJSON())
		Return
	EndIf

	If oModel <> Nil
		oModel:SetOperation(3)
		oModel:Activate()
	Else
		cError := 'Erro ao ativar o modelo de dados do lado do servidor!'
		Self:setStatus(500)
		jResponse['errorId']  := '002'
		jResponse['error']    := cErro
		jResponse['solution'] := 'Entre em contato com o administrador do servidor.'
	EndIf

	Begin Transaction
		If Empty(cError)

			If !CNPJ(jJson:GetJsonObject('cnpj'))
				Self:setStatus(500)
				jResponse['errorId']  := 'CNPJ_INVALIDO'
				jResponse['error']    := 'Erro ao validar o CNPJ'
				jResponse['solution'] := 'Revise está informação!'
				Self:SetResponse(jResponse:toJSON())
				Return
			EndIf

			oMdlSA2 := oModel:GetModel("SA2MASTER")
			oMdlSA2:setValue("A2_COD",       GetCodCad('SA2','A2_COD') )
			oMdlSA2:setValue("A2_LOJA",      "00")
			oMdlSA2:setValue("A2_NOME",      jJson:GetJsonObject('razaoSocial'))
			oMdlSA2:setValue("A2_NREDUZ",    jJson:GetJsonObject('nomeFantasia'))
			oMdlSA2:setValue("A2_END",       FwNoAccent(Upper(DecodeUTF8(jJson:GetJsonObject('logradouro')))))
			oMdlSA2:setValue("A2_TIPO",      "J")
			oMdlSA2:setValue("A2_EST",       jJson:GetJsonObject('estado'))
			oMdlSA2:setValue("A2_MUN",       FwNoAccent(Upper(DecodeUTF8(jJson:GetJsonObject('municipio')))))
			oMdlSA2:setValue("A2_CEP",       jJson:GetJsonObject('cep'))
			oMdlSA2:setValue("A2_CGC",       jJson:GetJsonObject('cnpj'))
			oMdlSA2:setValue("A2_PAIS",      jJson:GetJsonObject('pais'))
			oMdlSA2:setValue("A2_EMAIL",     jJson:GetJsonObject('email'))
			oMdlSA2:setValue("A2_DDD",       Substr(jJson:GetJsonObject('celular'),3,2))
			oMdlSA2:setValue("A2_TEL",       jJson:GetJsonObject('celular'))
			oMdlSA2:setValue("A2_MSBLQL",    "2")
			oMdlSA2:setValue("A2_CADSUP",    "1") //Cadastro via Web?
			oMdlSA2:setValue("A2_PASSUP",    GetPassword(jJson:GetJsonObject('password'), .F.))
			oMdlSA2:setValue("A2_TOKEN",     GetPassword(jJson:GetJsonObject('token')))
		Else
			Self:setStatus(500)
			jResponse['errorId']  := '003'
			jResponse['error']    := 'Erro ao inserir os dados!'
			jResponse['solution'] := 'Entre em contato com o administrador do servidor.'
			Self:SetResponse(jResponse:toJSON())
			Return
		EndIf

		If oModel:VldData()
			If oModel:CommitData()
				xResponse := u_AdminTkSpl(3, jJson:GetJsonObject('token'))
				If xResponse != 0
					DisarmTransaction()
					Self:setStatus(500)
					jResponse['errorId']  := '004'
					jResponse['error']    := 'Houve um erro interno.'
					jResponse['solution'] := EncodeUTF8('Erro ao fazer a exclusão do token. Não é possível seguir sem a exclusão.')
					Self:SetResponse(jResponse:toJSON())
					Return
				Else
					jResponse['message'] := 'Cadastro realizado com sucesso.'
				EndIf
			Else
				lRet := .F.
			EndIf
		Else
			lRet := .F.
			Self:setStatus(500)
			jResponse['errorId']  := '005'
			jResponse['error']    := 'Erro ao validar os dados!'
			jResponse['solution'] := 'Revise os dados preenchidos!'
			Self:SetResponse(jResponse:toJSON())
			Return
		EndIf
	End Transaction

	If !lRet
		aErro := oModel:GetErrorMessage()
		Self:setStatus(500)
		jResponse['errorId']  := '006'
		jResponse['error']    := AllToChar(aErro[6])
		jResponse['solution'] := AllToChar(aErro[7])
	EndIf

	Self:SetResponse(jResponse:toJSON())

Return lRet

/*/{Protheus.doc} supplierPortal
Retorna a lista de tokens gerados, para que seja verificado
do lado do frontend se existe o token digitado.
@author Gabriel Paixão
@since 03/03/2024
@version 1.0
@type wsrestful
/*/
WSMETHOD GET NEW WSRECEIVE WSSERVICE supplierPortal

	Local lRet       := .T.
	Local jResponse  := JsonObject():New()
	Local aToken	 := U_AdminTkSpl(2)
	Local aDataJson	 := {}
	Local nX		 := 0
	Local nLenJson   := 0

	//Retorna os tokens disponíveis no servidor
	If ValType(aToken) == 'A' .And. Len(aToken) > 0
		For nX := 1 To Len(aToken)
			nLenJson++
			aAdd(aDataJson, JsonObject():new())
			aDataJson[nLenJson]["token"] := aToken[nX]
		Next
		jResponse['data'] := aDataJson
	Else
		jResponse['errorId']  := '002'
		jResponse['error']    := EncodeUTF8('Nenhum token foi encontrado!')
		jResponse['solution'] := 'Certifique-se que o token foi gerado.'
		lRet := .F.
	EndIf

	Self:SetContentType('application/json')
	Self:SetResponse(jResponse:toJson())

Return lRet

/*/{Protheus.doc} GetCod
Retona o próximo código de fornecedor de acordo com a tabela SA2
@Type Function
@Author Gabriel Paixão
@Since 28/02/2024
/*/
Static Function GetCodCad(cAlias, cCampo)
Return GetSxeNum(cAlias,cCampo)

/*/{Protheus.doc} GetPassword
Retorna a senha do fornecedor criptografada ou descriptografada
@Type Function https://tdn.totvs.com/display/tec/WebEncript
@Param cPass [Senha enviada], lAction [Ação a ser feita, se .F. criptografa se .T. descriptografa]
@Author Gabriel Paixão
@Since 28/02/2024
/*/
Static Function GetPassword(cPass, lAction)
Return Iif(lAction, WebEncript(cPass, .T.), WebEncript(cPass, .F.))

/*/{Protheus.doc} AdminTkSpl
Realiza a gestão do token do fornecedor.
@Type Function
@Author Gabriel Paixão
@Params nRout (numeric) {
	1 - Gera um token novo, para permitir o cadastro do fornecedor
	2 - Verifica se o token informado existe na base
	3 - Apaga o token após o commit do forneceodr
}  	 
@Since 29/02/2024
/*/
User Function AdminTkSpl(nRoute, cToken)

	Local xRet     := .T.
	Local cPath    := SuperGetMV("SP_PTHTKN",,"\spl_portal")
	Local nHandle
	Local lWs	   := IsBlind()
	Local aFiles   := {}

	Default cToken := ''
	Default nRoute := 1

	If nRoute == 1
		If !File(cPath)
			nHandle := MakeDir(cPath)
			If nHandle != 0
				xRet := .F.
			EndIf
		EndIf
		If xRet
			cToken := UUIDRandom()
		EndIf
		If !Empty(cToken)
			nHandle := fCreate(cPath + '\' + cToken)
			If nHandle == -1
				xRet := .F.
			Else
				fClose(nHandle)
			EndIf
		EndIf
		If !lWs .And. !Empty(cToken)
			FwAlertSuccess("Um novo token foi gerado: " + cToken ,'Sucesso!')
			CopyToClipBoard(cToken)
		Else
			FwAlertError("Ocorreu um erro ao gerar o token! Por favor, entre em contato com administrador.", "Erro")
		EndIf
	ElseIf nRoute == 2
		aDir(cPath + '\*.*', aFiles)
		If Len(aFiles) == 0
			xRet := .F.
		Else
			xRet := aFiles
		EndIf
	ElseIf nRoute == 3
		xRet := fErase(cPath + '\' + Lower(cToken))
	EndIf

Return xRet

/*/{Protheus.doc} StorageBud
Grava as informações dos eventos na ZLX
para que os eventos sejam lidos no Supplier Portal
@Type Function
@Author Gabriel Paixão
@Params, aData, array, dados para salvar
@Params, cCodEven, caractere, código do evento a ser consumido
@Params, lAction, lógico, se .t. abre o evento, se .f. encerra o evento
@Since 18/03/2024
/*/
User Function StorageBud(aData, cCodEven, lAction)

	Local lRet   := Len(aData) > 0
	Local nX,nI  := 0
	Local cProds := ""

	Default cCodEven := ""

	If lRet .And. !Empty(cCodEven)
		For nX := 1 to Len(aData)

			For nI := 1 To Len(aData[nX,5])
				If nI == Len(aData[nX,5])
					cProds += aData[nX,5][nI][1] + '.' + AllTrim(aData[nX,5][nI][2]) + '.' + cValToChar(aData[nX,5][nI][3]) + '.' + aData[nX,5][nI][4] + '.' + aData[nX,5][nI][5] + '.' + aData[nX,5][nI][6] + '.' + aData[nX,5][nI][7] + '.' + aData[nX,5][nI][8] + ''
				Else
					cProds += aData[nX,5][nI][1] + '.' + AllTrim(aData[nX,5][nI][2]) + '.' + cValToChar(aData[nX,5][nI][3]) + '.' + aData[nX,5][nI][4] + '.' + aData[nX,5][nI][5] + '.' + aData[nX,5][nI][6] + '.' + aData[nX,5][nI][7] + '.' + aData[nX,5][nI][8] + ';'
				EndIf
			Next nI

			If RecLock('ZLX', .T.) .And. !Empty(cProds)
				ZLX->ZLX_IDEVEN  := GetCodCad('ZLX','ZLX_IDEVEN')
				ZLX->ZLX_CODEVEN := cCodEven
				ZLX->ZLX_STATUS  := '2'
				ZLX->ZLX_TOKEN   := aData[nX,3]
				ZLX->ZLX_ACAO    := AllTrim(cProds)
				ZLX->ZLX_ORCAME  := aData[nX,4]
				ZLX->(MsUnlock())
			Else
				lRet := .F.
			EndIf
		Next
	EndIf

Return lRet

/*/{Protheus.doc} GetJsonBudget
Cria o objeto JSON para retornar o produto mais vendido e o menos vendido
@Type Function
@Author Gabriel Paixão
@Params aData, array, Dados da query para criar o JSON
@Since 08/04/2024
/*/
Static Function PrdVenQry(aData)

	Local aDataJson    := {}
	Local nLenJson     := 0
	Local nX       	   := 0
	Local oJson        := JsonObject():New()

	Default aData   := {}

	If ValType(aData) == 'A' .And. Len(aData) > 0
		For nX := 1 To Len(aData)
			nLenJson++
			aAdd(aDataJson, JsonObject():new())
			aDataJson[nLenJson]["type"] 		:= aData[nX,1]
			aDataJson[nLenJson]["description"] 	:= Upper(aData[nX,2])
			aDataJson[nLenJson]["soldAmount"] 	:= aData[nX,3]
		Next
	EndIf

	oJson := aDataJson

Return oJson

/*/{Protheus.doc} GetJsonBudget
Cria o objeto JSON para retornar o orçamento
@Type Function
@Author Gabriel Paixão
@Params aData, array, Dados do orçamento para gerar o JSON
@Since 22/03/2024
/*/
Static Function GetJsonBudget(aData)

	Local aDataJson    := {}
	Local aProds,aAux  := {}
	Local nLenJson     := 0
	Local nX,nI	       := 0
	Local oJson        := JsonObject():New()
	Local aJson		   := {}

	Default aData   := {}

	If ValType(aData) == 'A' .And. Len(aData) > 0
		For nX := 1 To Len(aData)
			nLenJson++
			aAdd(aDataJson, JsonObject():new())
			aAux := StrTokArr(AllTrim(aData[nX,3]), ';')
			For nI := 1 to Len(aAux)
				If Len(aAux) > 0
					aProds := StrTokArr(aAux[nI], '.')
					aAdd(aJson, {aProds[1], aProds[2], aProds[3], aProds[4], aProds[5], aProds[6], aProds[7], aProds[8]})
				EndIf
			Next
			aDataJson[nLenJson]["numOrcamento"] := aData[nX,1]
			aDataJson[nLenJson]["token"] 		:= aData[nX,2]
			aDataJson[nLenJson]["produtos"] 	:= aJson

			aJson := {}
		Next
	EndIf

	oJson := aDataJson
	Self:SetResponse(oJson:toJson())

Return oJson

/*/{Protheus.doc} SetBudget
Seta o preço no orçamento enviado pelo Supplier
@Type Function
@Author Gabriel Paixão
@Params cToken, caractere, token unico do fornecedor
@Params cNumOrc, caractere, numero do orçamento a ser atualizado
@Params cCodProd, caractere, código do produto que será atualizado no orçamento
@Params cProdDesc, caractere, descrição do produto
@Params cVlrProp, caractere, valor proposto pelo fornecedor, que será atualizado
@Params cPrzEntre, caractere, prazo de entrega do fornecedor
@Params cNumItem, caractere, Numero do item na lista de orçamento
@Params cNumProd, caractere, Numero do produto na lista de orçamento
@Since 25/03/2024
/*/
Static Function SetBudget(cToken, cNumOrc, cCodProd, cProdDesc, cVlrProp, cPrzEntre, cNumItem, cNumProd, cQuantProd)

	Local aArea      := FwGetArea()
	Local lRet 	     := .F.
	Local nQuantProd := 0
	Local nVlrProp	 := 0
	Local aCabec 	 := {}
	Local aItens 	 := {}
	Local cUnMed 	 := ''

	Private lMsErroAuto := .F.


	DbSelectArea("SC8")
	DbSetOrder(1)

	If DbSeek(xFilial("SC8") + cNumOrc)

		aAdd(aCabec,{"C8_FORNECE" 	,SC8->C8_FORNECE})
		aAdd(aCabec,{"C8_LOJA" 		,SC8->C8_LOJA})
		aAdd(aCabec,{"C8_COND" 		,"C01"})
		aAdd(aCabec,{"C8_CONTATO" 	,"AUTO"})
		aAdd(aCabec,{"C8_FILENT" 	,FWxFilial()})
		aAdd(aCabec,{"C8_MOEDA" 	,1})
		aAdd(aCabec,{"C8_EMISSAO" 	,dDataBase})


		cUnMed := ReadValue('SB1',1,FwxFilial("SB1") + cCodProd , "B1_UM")

		nQuantProd := Val(cQuantProd)
		nVlrProp   := Val(cVlrProp)

		aAdd(aItens,{{"C8_NUMPRO" 	, cNumProd 				,Nil},;
			{"C8_PRODUTO" 			, cCodProd				,Nil},;
			{"C8_ITEM" 				, cNumItem				,Nil},;
			{"C8_UM" 				, cUnMed				,Nil},;
			{"C8_QUANT" 			, nQuantProd 			,Nil},;
			{"C8_PRAZO" 			, Val(cPrzEntre) 		,Nil},;
			{"C8_PRECO" 			, nVlrProp 				,NIL},;
			{"C8_TOTAL" 			, nQuantProd * nVlrProp ,NIL}})

		MSExecAuto({|v,x,y| MATA150(v,x,y)},aCabec,aItens,3)

		If !lMsErroAuto
			lRet := .T.
			//Atualiza o status para informação do supplier portal
			u_UpdStatSpl(cNumOrc, SC8->C8_FORNECE ,cNumItem, 1, SC8->C8_LOJA)
		EndIf
	EndIf

	FwRestArea(aArea)

Return lRet

/*/{Protheus.doc} UpdStatSpl
Atualiza o status do orçamento, para que o supplier portal consulte
e exiba a informação atualizada do orçamento para o fornecedor
@Type Function
@Params nStatus, numeric, Numero do status que deve ser atualizado
	[0] - Orçamento pendente (Aparecerá no portal)
	[1] - Orçamento enviado (Aparecerá no portal)
	[3] - Falta de estoque comunicada (Aparecerá no portal)
	[4] - Orçamento escolhido - Aprovado (Aparecerá no portal)
@Params cOrcamento, caractere, Numero do orçamento a ser atualizado
@Params cItem, caractere, Numero do item do orçamento a ser atualizado
@Params cLoja, caractere, Loja do fornecedor
@Params cForne, caractere, Código do fornecedor
@Author Gabriel Paixão
@Since 26/03/2024
/*/
User Function UpdStatSpl(cOrcamento, cForne , cItem, nStatus, cLoja)

	Local lRet := !Empty(cOrcamento) .Or. !Empty(cItem) .Or. !Empty(nStatus) .Or. !Empty(cLoja)

	If lRet
		DbSelectArea("SC8")
		SC8->(DbSetOrder(1))

		If SC8->(DbSeek(xFilial("SC8") + cOrcamento + cForne + cLoja + cItem))
			If RecLock('SC8', .F.)
				SC8->C8_XSTSPL := nStatus
				If nStatus == 3
					SC8->C8_QUANT := 0
					SC8->C8_PRAZO := 0
					SC8->C8_PRECO := 0
					SC8->C8_TOTAL := 0
					SC8->C8_OBS   := GetObsOffB()
				EndIf
				SC8->(MsUnlock())
			EndIf
		EndIf
	EndIf

Return lRet


/*/{Protheus.doc} GetObsOffB
Retorna a mensagem de observação para adicionar no campo C8_OBS
quando o fornecedor comunica a falta de estoque no portal
@Author Gabriel Paixão
@Since 29/03/2024
/*/
Static Function GetObsOffB()
Return SuperGetMV("SP_MSOBSOB",,"Falta de estoque comunicada pelo fornecedor dia: " + DtoC(Date()) + " as: " + Time())

/*/{Protheus.doc} GetStProd
Retorna o status do produto
@Params nStatus, numeric, status do produto
@Author Gabriel Paixão
@Since 27/03/2024
/*/
User Function GetStProd(nStatus)

	Local cRet := ""

	If nStatus == 0
		cRet := 'pendente'
	ElseIf nStatus == 1
		cRet := 'enviado'
	ElseIf nStatus == 3
		cRet := 'semEstoque'
	ElseIf nStatus == 4
		cRet := 'aprovado'
	EndIf

Return cRet

/*/{Protheus.doc} UsrSuplier
Retorna se o fornecedor é usuário do Supplier Portal
@Params nCodFor, caractere, código fo fornecedor
@Author Gabriel Paixão
@Since 31/03/2024
/*/
User Function UsrSupplier(cCod)

	Local lRet     := .T.
	Local lAtivo   := .F.
	Local aArea    := FwGetArea()
	Local aAreaSA2 := SA2->(FwGetArea())

	Default cCod := ""

	If !Empty(cCod)
		DbSelectArea('SA2')
		DbSetOrder(1)
		If SA2->(DbSeek(xFilial("SA2") + cCod))
			lAtivo := SA2->A2_MSBLQL == '2'
			If lAtivo
				lUsr := SA2->A2_CADSUP == '1'// Cadastrado via portal?
				If !lUsr
					lRet := .F.
				EndIf
			Else
				lRet := .F.
			EndIf
		EndIf
	EndIf

	FwRestArea(aArea)
	FwRestArea(aAreaSA2)

Return lRet

/*/{Protheus.doc} ExistZLX
Verifica se existe ZLX em aberto para o fornecedor informado
e retorna os orçamentos e recnos em aberto
@Params nCodFor, caractere, código fo fornecedor
@Author Gabriel Paixão
@Since 31/03/2024
/*/
User Function ExistZLX(cCod)

	Local aRet   := {}
	Local aArea  := FwGetArea()
	Local cToken := ''
	Local cQry   := ''
	Local aPar	 := {}
	Local cAlias := ''

	Default cCod := ""

	DbSelectArea('SA2')
	SA2->(DbSetOrder(1))

	If SA2->(DbSeek(xFilial("SA2") + cCod))
		cToken := SA2->A2_TOKEN
	EndIf

	If !Empty(cToken)
		cQry += " SELECT ZLX_ORCAME, ZLX_TOKEN, ISNULL(CAST(CAST(ZLX_ACAO AS VARBINARY(8000)) AS VARCHAR(8000)),'') AS ZLX_ACAO, R_E_C_N_O_ AS RECNO FROM "+RetSqlName("ZLX") + " WHERE ZLX_STATUS =? AND ZLX_TOKEN =? AND D_E_L_E_T_ <> ?"

		aPar 	:= {'2', GetPassword(cToken, .T.), "*"}

		cAlias 	:= MPSysOpenQuery(cQry,,,,aPar)

		(cAlias)->(DbGoTop())
		While (cAlias)->(!EoF())
			aAdd(aRet, {(cAlias)->ZLX_ORCAME, (cAlias)->ZLX_ACAO, (cAlias)->RECNO})
			(cAlias)->(DbSkip())
		EndDo
	EndIf

	SA2->(DbCloseArea())
	FwRestArea(aArea)

Return aRet
