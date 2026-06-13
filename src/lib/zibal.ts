export interface ZibalRequestParams {
  amountToman: number;
  orderId: string;
  callbackUrl: string;
  description?: string;
}

export interface ZibalRequestResponse {
  result: number;
  trackId?: number;
  message: string;
  redirectUrl?: string;
}

export interface ZibalVerifyResponse {
  result: number;
  amount?: number;
  status?: number;
  refNumber?: string;
  message: string;
}

const ZIBAL_API_URL = "https://gateway.zibal.ir/v1";

export async function requestPayment(params: ZibalRequestParams): Promise<ZibalRequestResponse> {
  const merchant = process.env.ZIBAL_MERCHANT_ID || "zibal";
  const amountRials = params.amountToman * 10; // convert Toman to Rial

  try {
    const response = await fetch(`${ZIBAL_API_URL}/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant,
        amount: amountRials,
        callbackUrl: params.callbackUrl,
        orderId: params.orderId,
        description: params.description || `سفارش FERBM - ${params.orderId}`,
      }),
    });

    const data = await response.json();
    
    // Result 100 means success
    if (data.result === 100) {
      const redirectUrl = merchant === "zibal"
        ? `https://gateway.zibal.ir/start/${data.trackId}/sandbox`
        : `https://gateway.zibal.ir/start/${data.trackId}`;

      return {
        result: data.result,
        trackId: data.trackId,
        message: data.message || "موفقیت‌آمیز",
        redirectUrl,
      };
    }

    return {
      result: data.result,
      message: data.message || "خطا در درخواست درگاه پرداخت",
    };
  } catch (error) {
    console.error("Zibal Payment Request Error:", error);
    return {
      result: -1,
      message: "خطای شبکه در اتصال به درگاه زیبال",
    };
  }
}

export async function verifyPayment(trackId: string): Promise<ZibalVerifyResponse> {
  const merchant = process.env.ZIBAL_MERCHANT_ID || "zibal";

  try {
    const response = await fetch(`${ZIBAL_API_URL}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant,
        trackId: Number(trackId),
      }),
    });

    const data = await response.json();
    return {
      result: data.result,
      amount: data.amount ? data.amount / 10 : undefined, // Convert Rial back to Toman
      status: data.status,
      refNumber: data.refNumber,
      message: data.message || "بررسی پرداخت انجام شد",
    };
  } catch (error) {
    console.error("Zibal Payment Verify Error:", error);
    return {
      result: -1,
      message: "خطای شبکه در تایید تراکنش زیبال",
    };
  }
}
