//==============================================================================
//ExtComPlugin
//==============================================================================

//==============================================================================
//nexacro.Event.ExtComPluginEventInfo
//ExtComPlugin�� ��û�� �۾��� �������� �� �߻��Ǵ� �̺�Ʈ���� ���Ǵ� EventInfo Object
//==============================================================================

if(!nexacro.Event.ExtComPluginEventInfo)
{
    nexacro.Event.ExtComPluginEventInfo = function (strEventId, strSvcId, intReason, strReturnValue)
    {
        this.eventid = strEventId;                                              // �̺�ƮID
        this.svcid = strSvcId;                                                  // �̺�Ʈ ���� ID
        this.reason = intReason;                                                // �̺�Ʈ �߻��з� �ڵ�
        this.returnvalue = strReturnValue;                                      // �̺�Ʈ ������ (type:Variant)
    }
    _pExtComPluginEventInfo = nexacro.Event.ExtComPluginEventInfo.prototype = nexacro._createPrototype(nexacro.Event);
    _pExtComPluginEventInfo._type = "nexacroExtComPluginEventInfo";
    _pExtComPluginEventInfo._type_name = "ExtComPluginEventInfo";
    _pExtComPluginEventInfo = null;
}

//==============================================================================
//nexacro.Event.ExtComPluginErrorEventInfo
//ExtComPlugin�� ��û�� �۾��� �������� �� �߻��Ǵ� �̺�Ʈ���� ���Ǵ� EventInfo Object
//==============================================================================
if(!nexacro.Event.ExtComPluginErrorEventInfo)
{
    nexacro.Event.ExtComPluginErrorEventInfo = function (strEventId, strSvcId, intReason, intErrorCode, strErrorMsg)
    {
        this.eventid = strEventId;                                              // �̺�ƮID
        this.svcid = strSvcId;                                                  // �̺�Ʈ ���� ID
        this.reason = intReason;
        this.errorcode = intErrorCode;
        this.errormsg = strErrorMsg;

    }
    _pExtComPluginErrorEventInfo = nexacro.Event.ExtComPluginErrorEventInfo.prototype = nexacro._createPrototype(nexacro.Event);
    _pExtComPluginErrorEventInfo._type = "nexacroExtComPluginErrorEventInfo";
    _pExtComPluginErrorEventInfo._type_name = "ExtComPluginErrorEventInfo";
    _pExtComPluginErrorEventInfo = null;
}

//==============================================================================
//nexacro.ExtComPlugin
//ExtComPlugin�� �����ϱ� ���� ����Ѵ�.
//==============================================================================
if (!nexacro.ExtComPlugin)
{
    nexacro.ExtComPlugin = function(name, obj)                    //52��
    {
        this._id = nexacro.Device.makeID();
        nexacro.Device._userCreatedObj[this._id] = this;
        this.name = name || "";

        this.enableevent = true;

        this.timeout = 10;

        this._clsnm = ["ExtComPlugin"];                            //62��
        this._reasoncode = {
            constructor : {ifcls: 0, fn: "constructor"},
            destroy     : {ifcls: 0, fn: "destroy"},

            callMethod  : {ifcls: 0, fn: "callMethod"},
        };

        this._event_list = {
            "oncallback": 1,
        };

        // native constructor
        var params = {} ;
        var fninfo = this._reasoncode.constructor;
        this._execFn(fninfo, params);
    };

    var _pExtComPlugin = nexacro.ExtComPlugin.prototype = nexacro._createPrototype(nexacro.EventSinkObject);

    _pExtComPlugin._type = "nexacroExtComPlugin";
    _pExtComPlugin._type_name = "ExtComPlugin";

    _pExtComPlugin.destroy = function()
    {
        var params = {};
        var jsonstr;

        delete nexacro.Device._userCreatedObj[this._id];

        var fninfo = this._reasoncode.destroy;
        this._execFn(fninfo, params);
        return true;
    };

    //===================User Method=========================//
    _pExtComPlugin.callMethod = function(methodid, param)
    {
        var fninfo = this._reasoncode.callMethod;

        var params = {};

        params.serviceid =  methodid;
        params.param     =  param;

        this._execFn(fninfo, params);
    };

    //===================Native Call=========================//
    _pExtComPlugin._execFn = function(_obj, _param)
    {
        if(nexacro.Device.curDevice == 0)
        {
            var jsonstr = this._getJSONStr(_obj, _param);
            this._log(jsonstr);
            nexacro.Device.exec(jsonstr);
        }
        else
        {
            var jsonstr = this._getJSONStr(_obj, _param);
            this._log(jsonstr);
            nexacro.Device.exec(jsonstr);
        }
    }

    _pExtComPlugin._getJSONStr = function(_obj, _param)
    {
        var _id = this._id;
        var _clsnm = this._clsnm[_obj.ifcls];
        var _fnnm = _obj.fn;
        var value = {};
        value.id = _id;
        value.div = _clsnm;
        value.method = _fnnm;
        value.params = _param;

        return  JSON.stringify(value);
    }

    _pExtComPlugin._log = function(arg)
    {
        if(trace) {
            trace(arg);
        }
    }


    //===================EVENT=========================//
    _pExtComPlugin._oncallback = function(objData) {
        var e = new nexacro.Event.ExtComPluginEventInfo("oncallback", objData.svcid, objData.reason, objData.returnvalue);
        this.$fire_oncallback(this, e);
    };
    _pExtComPlugin.$fire_oncallback = function (objExtComPlugin, eExtComPluginEventInfo) {
        if (this.oncallback && this.oncallback._has_handlers) {
            return this.oncallback._fireEvent(this, eExtComPluginEventInfo);
        }
        return true;
    };

    delete _pExtComPlugin;
}