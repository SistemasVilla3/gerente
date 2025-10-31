export function formatNumber(
        value: number,
        locale = 'en-US',
        opts: Intl.NumberFormatOptions = { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
         }
        ): string {
        return new Intl.NumberFormat(locale, opts).format(value);
    }