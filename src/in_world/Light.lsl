string home_url = "http://xxx/SecondLife?";

light(integer is_on) {
	// 面は4
	if(is_on == 1) {
		// 電気をつけた状態
		// 明るさオン
		// グロー 0.01
		// 光の色 #FFD7AA (255,215,170)
		// 輝度1, 半径5,　弱まる0.5
		llSetPrimitiveParams([
			PRIM_FULLBRIGHT, 4, TRUE,
			PRIM_GLOW, 4, 0.01,
			PRIM_POINT_LIGHT, TRUE, <1, 0.8431, 0.6667>, 1.0, 8.0, 0.5
			]);
	}
	else {
		// 通常状態
		// 明るさオフ
		// グロー 0.00
		llSetPrimitiveParams([
			PRIM_FULLBRIGHT, 4, FALSE,
			PRIM_GLOW, 4, 0.00,
			PRIM_POINT_LIGHT, FALSE, ZERO_VECTOR, 1.0, 8.0, 0.5
			]);

	}
}

integer i = 0;

default {

	state_entry() {
		llRequestURL();
	}

	changed(integer what) {
		if(what & CHANGED_REGION_START) {
			llRequestURL();
		}
	}

	http_request(key id, string method, string body) {
		if (method == URL_REQUEST_GRANTED) {
			llHTTPRequest(home_url + "type=set&url=" + llEscapeURL(body), [], "");
		} else if (method == URL_REQUEST_DENIED) {
			llOwnerSay("No URLs free !");
		} else if (method == "GET") {
			string data = llGetHTTPHeader(id, "x-query-string");
			light((integer)data);
			llHTTPResponse(id, 200, "1");
		}
	}

	touch_start(integer num_detected) {
		llHTTPRequest(home_url + "type=lightOnOff", [], "");
	}

}
