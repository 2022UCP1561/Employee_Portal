using System;
using System.Collections.Generic;

namespace WebApplication1.Helpers
{
    public static class OtpStore
    {
        public static Dictionary<string, (string Otp, DateTime Expiry)> Store = new();
    }
}
