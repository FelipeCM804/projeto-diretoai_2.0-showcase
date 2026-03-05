
import { useReservas } from "@/hooks/useReservas";
import { ReservasHeader } from "@/components/reservas/ReservasHeader";
import { ReservasTable } from "@/components/reservas/ReservasTable";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

const Reservas = () => {
    const { reservas, loading, refreshing, loadingReservas, refreshReservas, handleMarcarEntregue } = useReservas();
    const isMobile = useIsMobile();

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 mb-20 animate-fade-in">
            <ReservasHeader onRefresh={refreshReservas} refreshing={refreshing} />

            <div className="mt-8">
                <ReservasTable
                    reservas={reservas}
                    loadingReservas={loadingReservas}
                    onMarcarEntregue={handleMarcarEntregue}
                />
            </div>

            {isMobile && <MobileNavigation />}
        </div>
    );
};

export default Reservas;
